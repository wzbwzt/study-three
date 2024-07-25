<template>
  <div>
    <canvas id="c"></canvas>
  </div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";
import AxisGridHelper from "../../utils/axisGrid.ts";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

onMounted(() => {
  base();
});
const base = () => {
  const canvas = document.querySelector("#c") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  const gui = new GUI();

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();
  {
    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  // 要更新旋转角度的对象数组
  const objects = <any>[];

  // 一球多用
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

  //没有材质（material）和几何体（geometry）。它只是代表一个局部空间
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
  //   scene.add(sunMesh);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  //地球的局部空间
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  //   earthMesh.position.x = 10;
  //   scene.add(earthMesh);
  //   sunMesh.add(earthMesh);
  //   solarSystem.add(earthMesh);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);

  const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  // 为每个节点添加一个AxesHelper: 可视化场景图中的节点,辅助绘制
  //   objects.forEach((node: any) => {
  //     const axes = new THREE.AxesHelper();
  //     (axes.material as THREE.Material).depthTest = false; //false:轴即使在球体内部也能出现,不会检查其是否在其他东西后面进行绘制
  //     axes.renderOrder = 1; //1: 会在所有球体之后被绘制。否则一个球体可能会画在它们上面，把它们遮住
  //     node.add(axes);
  //   });

  function makeAxisGrid(node: THREE.Object3D, label: string, units?: number) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  makeAxisGrid(solarSystem, "solarSystem", 25);
  makeAxisGrid(sunMesh, "sunMesh");
  makeAxisGrid(earthOrbit, "earthOrbit");
  makeAxisGrid(earthMesh, "earthMesh");
  makeAxisGrid(moonOrbit, "moonOrbit");
  makeAxisGrid(moonMesh, "moonMesh");

  const resizeRendererToDisplaySize = (renderer: any) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  };

  const render = (time: number) => {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj: any) => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};
</script>
<style scoped lang="css">
#c {
  width: 100%;
  height: 800px;
  display: block;
}
</style>
