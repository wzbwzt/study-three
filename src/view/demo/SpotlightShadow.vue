<template>
  <div>
    <canvas id="map" title="base" style="width: 100%"></canvas>
  </div>
</template>
<script setup>
import * as THREE from "three";
import { onMounted } from "vue";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

onMounted(() => {
  base();
});
const base = () => {
  const canvas = document.querySelector("#map");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 20, 30);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //背景光
  // scene.add(ambientLight());

  //聚光灯
  const spotlight = spotLight();
  scene.add(spotlight);

  //mesh
  const { plane, clinder } = meshs();
  scene.add(plane, clinder);

  {
    //投影
    clinder.castShadow = true;
    plane.receiveShadow = true;
    spotlight.castShadow = true;
    renderer.shadowMap.enabled = true;
  }

  {
    //划线
    // const line = drawLine();
    // scene.add(line);
  }

  {
    //增加x,y,z轴
    // const axes = axesHelper();
    // scene.add(axes);
  }

  {
    //控制器
    const control = new OrbitControls(camera, canvas);
  }

  function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  if (WebGL.isWebGL2Available()) {
    animate();
  } else {
    const warning = WebGL.getWebGL2ErrorMessage();
    console.log("webgl2 is not avilable;", warning);
  }
};
const drawLine = () => {
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  const points = [];
  points.push(new THREE.Vector3(-5, 0, 0));
  points.push(new THREE.Vector3(0, 5, 0));
  points.push(new THREE.Vector3(5, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);

  return line;
};
const axesHelper = () => {
  const axes = new THREE.AxesHelper(10);
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  return axes;
};
//创建背景光
const ambientLight = () => {
  const color = 0xffffff;
  const intensity = 10;
  const light = new THREE.AmbientLight(color, intensity);
  return light;
};

const spotLight = () => {
  const color = 0xffffff;
  const intensity = 3000;
  const light = new THREE.SpotLight(color, intensity);
  light.position.set(-10, 10, 0);
  light.angle = Math.PI / 6;
  light.penumbra = 0.3;
  return light;
};

const meshs = () => {
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // return cube;
  // 平面
  const plane_geo = new THREE.PlaneGeometry(100, 100);
  const plane_mater = new THREE.MeshPhongMaterial({ color: 0x808080 });
  const plane = new THREE.Mesh(plane_geo, plane_mater);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, -2, 0);

  //圆柱体
  const clinder_geo = new THREE.CylinderGeometry();
  const clinder_mater = new THREE.MeshPhongMaterial({ color: 0x909 });
  const clinder = new THREE.Mesh(clinder_geo, clinder_mater);
  clinder.position.set(0, 2, 0);
  return { plane, clinder };
};
</script>
<style scoped></style>
