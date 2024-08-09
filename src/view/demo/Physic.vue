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
import { AmmoPhysics } from "three/examples/jsm/physics/AmmoPhysics.js";
import Stats from "three/addons/libs/stats.module.js";

let canvas;
let scene, camera, renderer;
let hemispherelight, directlight; //light
let boxs, floor; //mesh
let gui; //helper
let orbitControl;
let physics;
let stats;

let timeId;

const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);
const position = new THREE.Vector3();

onMounted(async () => {
  initScene();
  initRenderer();
  initCamera();

  initAxesHelper();
  initHemispherelight();
  initDirectlight();
  initInstanceMeshs();
  initOrbitControl();
  initStats();
  // initGUI();
  enableShadow();
  enablePhysics();
  Render();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  cronTab();
});

onUnmounted(() => {
  if (gui) gui.destroy();

  clearInterval(timeId);

  document.body.removeChild(stats.dom);
});

const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x666666);
};
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-1, 1.5, 2);
  camera.lookAt(0, 0.5, 0);
};

const initRenderer = () => {
  canvas = document.querySelector("#container");
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
};

const initAxesHelper = () => {
  const axes = new THREE.AxesHelper(10);
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);
};

//半球光:模拟大气光，过度色
const initHemispherelight = () => {
  hemispherelight = new THREE.HemisphereLight();

  const helper = new THREE.HemisphereLightHelper(hemispherelight, 10);
  scene.add(helper);

  scene.add(hemispherelight);
};
const initDirectlight = () => {
  directlight = new THREE.DirectionalLight(0xffffff, 3);
  directlight.position.set(5, 5, 5);
  directlight.shadow.camera.zoom = 2;

  const helper = new THREE.DirectionalLightHelper(directlight);
  scene.add(helper);

  scene.add(directlight);
};

const initInstanceMeshs = () => {
  //floor
  const geometryPlane = new THREE.BoxGeometry(10, 5, 10);
  const shadowmater = new THREE.ShadowMaterial({ color: 0x444444 }); //只可以接收影子的材质，设置影子颜色
  floor = new THREE.Mesh(geometryPlane, shadowmater);
  floor.position.y = -2.5;
  scene.add(floor);

  //boxs
  const geometryBoxs = new THREE.BoxGeometry(0.075, 0.075, 0.075);
  const lamberMater = new THREE.MeshLambertMaterial(); //木头材质属性，非高光
  const count = 300;
  boxs = new THREE.InstancedMesh(geometryBoxs, lamberMater, count);
  boxs.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    matrix.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5);
    boxs.setMatrixAt(i, matrix);
    boxs.setColorAt(i, color.setHex(0xffffff * Math.random()));
  }

  scene.add(boxs);
};

const cronTab = () => {
  timeId = setInterval(() => {
    if (!physics) return;
    let index = Math.floor(Math.random() * boxs.count);

    position.set(0, Math.random() + 1, 0);
    physics.setMeshPosition(boxs, position, index);
  }, 1000 / 10);
};

const enablePhysics = async () => {
  physics = await AmmoPhysics();
  floor.userData.physics = { mass: 0 };
  boxs.userData.physics = { mass: 1 };
  physics.addScene(scene);
};
//投影
const enableShadow = () => {
  floor.receiveShadow = true;
  directlight.castShadow = true;
  boxs.castShadow = true;
  boxs.receiveShadow = true;

  renderer.shadowMap.enabled = true;
};

const initOrbitControl = () => {
  orbitControl = new OrbitControls(camera, canvas);
};
const initStats = () => {
  stats = new Stats();
  document.body.appendChild(stats.dom);
};

const render = () => {
  orbitControl.update();
  stats.update();

  requestAnimationFrame(render);

  renderer.render(scene, camera);
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
