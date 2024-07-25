<template>
  <canvas id="c" title="雾"></canvas>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

onMounted(() => {
  multiple();
});
const multiple = () => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    class FogGUIHelper {
      private fog: THREE.Fog;
      private backgroundColor: THREE.Color;
      constructor(fog: THREE.Fog, backgroundColor: THREE.Color) {
        this.fog = fog;
        this.backgroundColor = backgroundColor;
      }
      get near() {
        return this.fog.near;
      }
      set near(v) {
        this.fog.near = v;
        this.fog.far = Math.max(this.fog.far, v);
      }
      get far() {
        return this.fog.far;
      }
      set far(v) {
        this.fog.far = v;
        this.fog.near = Math.min(this.fog.near, v);
      }
      get color() {
        return `#${this.fog.color.getHexString()}`;
      }
      set color(hexString) {
        this.fog.color.set(hexString);
        this.backgroundColor.set(hexString);
      }
    }
    const near = 1;
    const far = 2;
    const color = "lightblue";
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);

    const gui = new GUI();
    const fogGUIHelper = new FogGUIHelper(scene.fog as THREE.Fog, scene.background);
    gui.add(fogGUIHelper, "near", near, far).listen();
    gui.add(fogGUIHelper, "far", near, far).listen();
    gui.addColor(fogGUIHelper, "color");
  }

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const makeInstance = (geometry: any, color: any, x: any) => {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  };
  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  // 检查渲染器的canvas尺寸是不是和canvas的显示尺寸不一样 如果不一样就设置它
  function resizeRendererToDisplaySize(renderer: any) {
    const canvas = renderer.domElement;

    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    // const width = canvas.clientWidth;
    // const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time: number) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      //将相机的宽高比设置为canvas的宽高比,解决缩放变形问题
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};
</script>
<style scoped lang="css">
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
