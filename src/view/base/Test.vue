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

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(2, 5, 10);
  //   camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  {
    //背景光
    scene.add(ambientLight());
  }
  {
    //mesh
    scene.add(meshs());
  }

  {
    //划线
    const line = drawLine();
    scene.add(line);
  }

  {
    //增加x,y,z轴
    const axes = axesHelper();
    scene.add(axes);
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

const meshs = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
};
</script>
<style scoped></style>
