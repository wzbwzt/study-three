<template>
  <canvas id="container"></canvas>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

let canvas;
let scene, camera, renderer;
let ambientlight, spotlight, plane, clinder;
let orbitControl;
let gui, spotlight_helper, camera_helper;

onMounted(() => {
  initScene();
  initRenderer();
  initCamera();
  initAxesHelper();
  initAmbientlight();
  initSpotlight();
  initSpotlightHelper();
  initMeshs();
  initOrbitControl();
  initGUI();
  //   initCameraHelper();
  render();
});

onUnmounted(() => {
  gui.destroy();
});

const initScene = () => {
  scene = new THREE.Scene();
};
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 20, 30);
  camera.lookAt(0, 0, 0);

  camera_helper = new THREE.CameraHelper(camera);
};

const initCameraHelper = () => {
  camera_helper = new THREE.CameraHelper(camera);
  scene.add(camera_helper);
};
const initRenderer = () => {
  canvas = document.querySelector("#container");
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initAxesHelper = () => {
  const axes = new THREE.AxesHelper(10);
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);
};

//背景光
const initAmbientlight = () => {
  const color = 0xffffff;
  const intensity = 10;
  ambientlight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientlight);
};

const initSpotlight = () => {
  const color = 0xffffff;
  const intensity = 3000;
  spotlight = new THREE.SpotLight(color, intensity);
  spotlight.position.set(-10, 10, 0);
  spotlight.angle = Math.PI / 6;
  spotlight.penumbra = 0.3;
  scene.add(spotlight);
};

const initSpotlightHelper = () => {
  spotlight_helper = new THREE.SpotLightHelper(spotlight);
  scene.add(spotlight_helper);
};

const initMeshs = () => {
  // 平面
  const plane_geo = new THREE.PlaneGeometry(100, 100);
  const plane_mater = new THREE.MeshPhongMaterial({ color: 0x808080 });
  plane = new THREE.Mesh(plane_geo, plane_mater);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, -2, 0);

  //圆柱体
  const clinder_geo = new THREE.CylinderGeometry();
  const clinder_mater = new THREE.MeshPhongMaterial({ color: 0x909 });
  clinder = new THREE.Mesh(clinder_geo, clinder_mater);
  clinder.position.set(0, 2, 0);

  scene.add(plane, clinder);
};

//投影
const initShaow = () => {
  clinder.castShadow = true;
  plane.receiveShadow = true;
  spotlight.castShadow = true;
  renderer.shadowMap.enabled = true;
};

const initOrbitControl = () => {
  orbitControl = new OrbitControls(camera, canvas);
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

const render = () => {
  if (WebGL.isWebGL2Available()) {
    animate();
  } else {
    const warning = WebGL.getWebGL2ErrorMessage();
    console.log("webgl2 is not avilable;", warning);
  }
};

const initGUI = () => {
  gui = new GUI();
  const spotLightFolder = gui.addFolder("SpotLight");
  spotLightFolder.addColor(spotlight, "color").onChange((color) => {
    spotlight.color.set(color);
    spotlight_helper.update();
  });
  spotLightFolder.add(spotlight, "angle", 0, Math.PI / 2).onChange((e) => {
    console.log(e);
    spotlight.angle = e;
    spotlight_helper.update();
  });

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder
    .add(camera.position, "x", -100, 100)
    .step(1)
    .onChange((x) => {
      camera.position.x = x;
      camera_helper.update();
    });

  gui.close();
};
</script>
<style scoped lang="scss"></style>
