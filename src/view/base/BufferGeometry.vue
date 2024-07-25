<template>
  <canvas id="c" title="自定义缓冲几何体"></canvas>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";

onMounted(() => {
  multiple();
});
const multiple = () => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas as HTMLCanvasElement,
  });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new THREE.Scene();
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // NOT A GOOD EXAMPLE OF HOW TO MAKE A CUBE!
  // Only trying to make it clear most vertices are unique
  const vertices = [
    // front
    { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] },
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },

    // { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
    // { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] },
    // right
    { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] },
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },

    // { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
    // { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] },
    // back
    { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] },
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },

    // { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
    // { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] },
    // left
    { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },

    // { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
    // { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] },
    // top
    { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] },
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },

    // { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
    // { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
    { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] },
    // bottom
    { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] },
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },

    // { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
    // { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
    { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] },
  ];
  const positions = [];
  const normals = [];
  const uvs = [];
  for (const vertex of vertices) {
    positions.push(...vertex.pos);
    normals.push(...vertex.norm);
    uvs.push(...vertex.uv);
  }

  const geometry = new THREE.BufferGeometry();
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2;
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
  geometry.setIndex([
    0,
    1,
    2,
    2,
    1,
    3, // front
    4,
    5,
    6,
    6,
    5,
    7, // right
    8,
    9,
    10,
    10,
    9,
    11, // back
    12,
    13,
    14,
    14,
    13,
    15, // left
    16,
    17,
    18,
    18,
    17,
    19, // top
    20,
    21,
    22,
    22,
    21,
    23, // bottom
  ]);

  const loader = new THREE.TextureLoader();
  const texture = loader.load("https://threejs.org/manual/examples/resources/images/star.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  function makeInstance(geometry: THREE.BufferGeometry, color: number, x: number) {
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    return cube;
  }

  const cubes = [makeInstance(geometry, 0x88ff88, 0), makeInstance(geometry, 0x8888ff, -4), makeInstance(geometry, 0xff8888, 4)];

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
