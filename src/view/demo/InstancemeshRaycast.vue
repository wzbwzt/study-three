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
let hemispherelight;
let meshs;
let orbitControl;
let gui;
let raycaster;
let pointer;

const amount = 10;
const count = Math.pow(amount, 3);
const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);

onMounted(() => {
  initScene();
  initRenderer();
  initCamera();

  initPoint();
  initRaycast();

  initAxesHelper();
  initHemispherelight();
  initInstanceMeshs();
  initOrbitControl();
  initGUI();
  Render();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener("mousemove", (event) => {
    event.preventDefault();
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1),以屏幕原点为(0,0)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1; //因为threey坐标朝上为正,而屏幕是y向下为正
  });
});

onUnmounted(() => {
  gui.destroy();
});

const initScene = () => {
  scene = new THREE.Scene();
};
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);
};

const initRenderer = () => {
  canvas = document.querySelector("#container");
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initPoint = () => {
  pointer = new THREE.Vector2(1, 1);
};

const initRaycast = () => {
  raycaster = new THREE.Raycaster();
};
const initAxesHelper = () => {
  const axes = new THREE.AxesHelper(10);
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);
};

//半球光:模拟大气光，过度色
const initHemispherelight = () => {
  hemispherelight = new THREE.HemisphereLight(0xffffff, 0x888888);
  hemispherelight.position.set(0, 1, 0);
  scene.add(hemispherelight);
};

const initInstanceMeshs = () => {
  const geometry = new THREE.IcosahedronGeometry(0.5, 3);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  meshs = new THREE.InstancedMesh(geometry, material, count);

  const matrix = new THREE.Matrix4();

  let index = 0;
  const offset = (amount - 1) / 2; //4.5
  for (let x = 0; x < amount; x++) {
    for (let y = 0; y < amount; y++) {
      for (let z = 0; z < amount; z++) {
        matrix.setPosition(offset - x, offset - y, offset - z); //-4.5 ~ +4.5
        meshs.setMatrixAt(index, matrix);
        meshs.setColorAt(index, white);

        index++;
      }
    }
  }
  scene.add(meshs);
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

const render = () => {
  orbitControl.update();

  requestAnimationFrame(render);

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObject(meshs);
  if (intersects.length > 0) {
    const instanceId = intersects[0].instanceId;

    meshs.getColorAt(instanceId, color);
    if (color.equals(white)) {
      meshs.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));

      meshs.instanceColor.needsUpdate = true;
    }
  }

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
  gui.add(meshs, "count", 0, count).onChange((v) => {
    meshs["count"] = v;
  });
};
</script>
<style scoped lang="scss"></style>
