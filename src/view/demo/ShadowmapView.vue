<template>
  <canvas id="container"></canvas>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import Stats from "three/addons/libs/stats.module.js";
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer.js";

let canvas;
let scene, camera, renderer;
let ambientlight, directlight, spotlight; //light
let torusKnot, cube, ground; //mesh
let gui, lightCameraHelper; //helper
let orbitControl;
let stats;
let dirLightShadowMapViewer, spotLightShadowMapViewer;

const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);
const position = new THREE.Vector3();
const clock = new THREE.Clock();

onMounted(async () => {
  initScene();
  initRenderer();
  initCamera();

  initAxesHelper();
  initAmbientLight();
  initDirectlight();
  initSpotlight();
  initLightCameraHelper();
  initMeshs();
  initOrbitControl();
  initStats();
  initGUI();
  enableShadow();
  initShadowMapViewers();
  Render();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    resizeShadowmapView();
    dirLightShadowMapViewer.updateForWindowResize();
    spotLightShadowMapViewer.updateForWindowResize();
  });
});

onUnmounted(() => {
  if (gui) gui.destroy();

  if (stats) document.body.removeChild(stats.dom);
});

const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x666666);
};
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 15, 35);
  // camera.lookAt(0, 0.5, 0);
};

const initRenderer = () => {
  canvas = document.querySelector("#container");
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
};

const initAxesHelper = () => {
  const axes = new THREE.AxesHelper(10);
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);
};

const initAmbientLight = () => {
  ambientlight = new THREE.AmbientLight(0x404040, 3);

  scene.add(ambientlight);
};
const initDirectlight = () => {
  directlight = new THREE.DirectionalLight(0xffffff, 3);
  directlight.name = "direct light";
  directlight.position.set(0, 10, 0);

  scene.add(directlight);
};

const initSpotlight = () => {
  spotlight = new THREE.SpotLight(0xffffff, 500);
  spotlight.name = "spot light";
  spotlight.position.set(10, 10, 5);
  spotlight.angle = Math.PI / 5;
  spotlight.penumbra = 0.3;

  scene.add(spotlight);
};

const initLightCameraHelper = () => {
  directlight.shadow.camera.near = 1;
  directlight.shadow.camera.far = 10;
  directlight.shadow.camera.left = -15;
  directlight.shadow.camera.right = 15;
  directlight.shadow.camera.top = 15;
  directlight.shadow.camera.bottom = -15;
  directlight.shadow.mapSize.width = 1024;
  directlight.shadow.mapSize.height = 1024;
  scene.add(new THREE.CameraHelper(directlight.shadow.camera));

  spotlight.shadow.camera.near = 8;
  spotlight.shadow.camera.far = 30;
  spotlight.shadow.mapSize.width = 1024;
  spotlight.shadow.mapSize.height = 1024;
  scene.add(new THREE.CameraHelper(spotlight.shadow.camera));
};

const initMeshs = () => {
  let geometry = new THREE.TorusKnotGeometry(25, 8, 75, 20);
  let material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 150,
    specular: 0x222222,
  });
  torusKnot = new THREE.Mesh(geometry, material);
  torusKnot.scale.multiplyScalar(1 / 18); //缩小1/18
  torusKnot.position.y = 3;
  scene.add(torusKnot);

  geometry = new THREE.BoxGeometry(3, 3, 3);
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(8, 3, 8);
  scene.add(cube);

  geometry = new THREE.BoxGeometry(10, 0.15, 10);
  material = new THREE.MeshPhongMaterial({
    color: 0xa0adaf,
    shininess: 150,
    specular: 0x111111,
  });
  ground = new THREE.Mesh(geometry, material);
  ground.scale.multiplyScalar(3);
  scene.add(ground);
};

//投影
const enableShadow = () => {
  torusKnot.castShadow = true;
  torusKnot.receiveShadow = true;

  cube.castShadow = true;

  ground.receiveShadow = true;

  directlight.castShadow = true;

  spotlight.castShadow = true;
};

const initOrbitControl = () => {
  orbitControl = new OrbitControls(camera, canvas);
};
const initStats = () => {
  stats = new Stats();
  document.body.appendChild(stats.dom);
};
const initShadowMapViewers = () => {
  dirLightShadowMapViewer = new ShadowMapViewer(directlight);
  spotLightShadowMapViewer = new ShadowMapViewer(spotlight);
  resizeShadowmapView();
};

const resizeShadowmapView = () => {
  const size = window.innerWidth * 0.15;
  dirLightShadowMapViewer.position.x = 10;
  dirLightShadowMapViewer.position.y = 10;
  dirLightShadowMapViewer.size.width = size;
  dirLightShadowMapViewer.size.height = size;
  dirLightShadowMapViewer.update(); //Required when setting position or size directly

  spotLightShadowMapViewer.size.set(size, size);
  spotLightShadowMapViewer.position.set(size + 20, 10);
  // spotLightShadowMapViewer.update();	//NOT required because .set updates automatically
};

const render = () => {
  requestAnimationFrame(render);

  orbitControl.update();

  if (stats) stats.update();

  const delta = clock.getDelta();
  torusKnot.rotation.x += 0.25 * delta;
  torusKnot.rotation.y += 2 * delta;
  torusKnot.rotation.z += 1 * delta;
  // console.log(torusKnot.rotation.y);

  cube.rotation.x += 0.25 * delta;
  cube.rotation.y += 2 * delta;
  cube.rotation.z += 1 * delta;

  renderer.render(scene, camera);

  dirLightShadowMapViewer.render(renderer); //必须在 renderer.render(scene,camera) 之后调用
  spotLightShadowMapViewer.render(renderer);
};

const Render = () => {
  if (WebGL.isWebGL2Available()) {
    render();
  } else {
    const warning = WebGL.getWebGL2ErrorMessage();
    console.log("webgl2 is not avilable;", warning);
  }
};

const initGUI = () => {
  gui = new GUI();
};
</script>
<style scoped lang="scss"></style>
