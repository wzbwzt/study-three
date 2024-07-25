<template>
  <div>
    <canvas id="c" title="base"></canvas>
    <canvas id="d" title="base2"></canvas>
  </div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";

onMounted(() => {
  base();
  base2();
});
const base = () => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

  const fov = 75;
  // const fov = 40;
  const aspect = 2; // 相机默认值
  const near = 0.1;
  const far = 5;
  // const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  // camera.position.z = 120;
  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });//不受灯光影响的材质
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // 绿蓝色
  const cube = new THREE.Mesh(geometry, material);

  //动画旋转
  {
    const render = (time: number) => {
      time *= 0.001; // 将时间单位变为秒

      cube.rotation.x = time;
      cube.rotation.y = time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  //添加直射光束
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  //创建多个立方体
  // {
  //   const makeInstance = (geometry: any, color: number, x: number) => {
  //     const material = new THREE.MeshPhongMaterial({ color });

  //     const cube = new THREE.Mesh(geometry, material);
  //     scene.add(cube);

  //     cube.position.x = x;

  //     return cube;
  //   };
  //   const cubes = [
  //     makeInstance(geometry, 0x44aa88, 0),
  //     makeInstance(geometry, 0x8844aa, -2),
  //     makeInstance(geometry, 0xaa8844, 2),
  //   ];

  //   const render = (time: number) => {
  //     time *= 0.001; // 将时间单位变为秒

  //     cubes.forEach((cube, ndx) => {
  //       const speed = 1 + ndx * 0.1;
  //       const rot = time * speed;

  //       cube.rotation.x = rot;
  //       cube.rotation.y = rot;
  //       // renderer.render(scene, camera);
  //       // requestAnimationFrame(render);
  //     });
  //   };
  //   requestAnimationFrame(render);
  // }

  {
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.PointsMaterial({
      color: "red",
      sizeAttenuation: false,
      size: 3,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
  }

  scene.add(cube);
  renderer.render(scene, camera);
};
const base2 = () => {
  const canvas = document.querySelector("#d");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

  const fov = 40;
  const aspect = 2; // 相机默认值
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 25;
  const scene = new THREE.Scene();

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // 绿蓝色
  const cube = new THREE.Mesh(geometry, material);

  //动画旋转
  {
    const render = (time: number) => {
      time *= 0.001; // 将时间单位变为秒

      cube.rotation.x = time;
      cube.rotation.y = time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  //添加直射光束
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  {
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.PointsMaterial({
      color: "red",
      sizeAttenuation: false,
      size: 9,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const render = (time: number) => {
      time *= 0.001; // 将时间单位变为秒

      points.rotation.x = time;
      points.rotation.y = time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  scene.add(cube);
  renderer.render(scene, camera);
};
</script>
<style scoped lang="css">
#c {
  width: 50%;
  height: 100%;
  display: block;
}

#d {
  width: 50%;
  height: 100%;
  display: block;
}
</style>
