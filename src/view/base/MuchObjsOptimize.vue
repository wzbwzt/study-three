<template>
  <canvas id="c" title="大量对象的优化渲染(先)"></canvas>
  <canvas id="d" title="大量对象的优化渲染(后)"></canvas>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

onMounted(() => {
  globe();
  globe_adapt();
});
const globe = () => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

  const fov = 60;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2.5;

  const controls = new OrbitControls(camera, canvas as HTMLElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 4;
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("https://threejs.org/manual/examples/resources/images/world.jpg", render);
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.SphereGeometry(1, 64, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    scene.add(new THREE.Mesh(geometry, material));
  }

  async function loadFile(url: string) {
    const req = await fetch(url);
    return req.text();
  }

  function parseData(text: string) {
    const data: number[][] = [];
    const settings: { [key: string]: any } = { data };
    let max: number | undefined;
    let min: number | undefined;
    // split into lines
    text.split("\n").forEach((line) => {
      // split the line by whitespace
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        // only 2 parts, must be a key/value pair
        settings[parts[0]] = parseFloat(parts[1]);
      } else if (parts.length > 2) {
        // more than 2 parts, must be data
        const values = parts.map((v) => {
          const value = parseFloat(v);
          if (value === settings.NODATA_value) {
            return undefined;
          }

          max = Math.max(max === undefined ? value : max, value);
          min = Math.min(min === undefined ? value : min, value);
          return value;
        });
        data.push(values as number[]);
      }
    });
    return Object.assign(settings, { min, max });
  }

  function addBoxes(file: any) {
    const { min, max, data } = file;
    const range = max - min;

    // make one box geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    // make it so it scales away from the positive Z axis
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    const lonHelper = new THREE.Object3D();
    scene.add(lonHelper);
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);

    const lonFudge = Math.PI * 0.5;
    const latFudge = Math.PI * -0.135;
    data.forEach((row: number[], latNdx: number) => {
      row.forEach((value, lonNdx) => {
        if (value === undefined) {
          return;
        }

        const amount = (value - min) / range;
        const material = new THREE.MeshBasicMaterial();
        const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
        const saturation = 1;
        const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount);
        material.color.setHSL(hue, saturation, lightness);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // adjust the helpers to point to the latitude and longitude
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

        // use the world matrix of the position helper to
        // position this mesh.
        positionHelper.updateWorldMatrix(true, false);
        mesh.applyMatrix4(positionHelper.matrixWorld);

        mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
      });
    });
  }

  loadFile("https://threejs.org/manual/examples/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc").then(parseData).then(addBoxes).then(render);

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

  let renderRequested: boolean | undefined = false;

  function render() {
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      //将相机的宽高比设置为canvas的宽高比,解决缩放变形问题
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
  }

  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  controls.addEventListener("change", requestRenderIfNotRequested);
  window.addEventListener("resize", requestRenderIfNotRequested);
};
const globe_adapt = () => {
  const canvas = document.querySelector("#d");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

  const fov = 60;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2.5;

  const controls = new OrbitControls(camera, canvas as HTMLElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 4;
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("https://threejs.org/manual/examples/resources/images/world.jpg", render);
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.SphereGeometry(1, 64, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    scene.add(new THREE.Mesh(geometry, material));
  }

  async function loadFile(url: string) {
    const req = await fetch(url);
    return req.text();
  }

  function parseData(text: string) {
    const data: number[][] = [];
    const settings: { [key: string]: any } = { data };
    let max: number | undefined;
    let min: number | undefined;
    // split into lines
    text.split("\n").forEach((line) => {
      // split the line by whitespace
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        // only 2 parts, must be a key/value pair
        settings[parts[0]] = parseFloat(parts[1]);
      } else if (parts.length > 2) {
        // more than 2 parts, must be data
        const values = parts.map((v) => {
          const value = parseFloat(v);
          if (value === settings.NODATA_value) {
            return undefined;
          }

          max = Math.max(max === undefined ? value : max, value);
          min = Math.min(min === undefined ? value : min, value);
          return value;
        });
        data.push(values as number[]);
      }
    });
    return Object.assign(settings, { min, max });
  }

  function addBoxes(file: any) {
    const { min, max, data } = file;
    const range = max - min;

    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    const lonHelper = new THREE.Object3D();
    scene.add(lonHelper);
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);

    // 用来定位盒子的中心, 以便接下来沿着Z轴缩放
    const originHelper = new THREE.Object3D();
    originHelper.position.z = 0.5;
    positionHelper.add(originHelper);

    const lonFudge = Math.PI * 0.5;
    const latFudge = Math.PI * -0.135;
    const geometries: THREE.BufferGeometry<THREE.NormalBufferAttributes>[] = [];
    data.forEach((row: number[], latNdx: number) => {
      row.forEach((value, lonNdx) => {
        if (value === undefined) {
          return;
        }

        const amount = (value - min) / range;

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        // adjust the helpers to point to the latitude and longitude
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

        // use the world matrix of the origin helper to
        // position this geometry
        positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
        originHelper.updateWorldMatrix(true, false);
        geometry.applyMatrix4(originHelper.matrixWorld);

        geometries.push(geometry);
      });
    });
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
    const material = new THREE.MeshBasicMaterial({ color: "red" });
    const mesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(mesh);
  }

  loadFile("https://threejs.org/manual/examples/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc").then(parseData).then(addBoxes).then(render);

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

  let renderRequested: boolean | undefined = false;

  function render() {
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      //将相机的宽高比设置为canvas的宽高比,解决缩放变形问题
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
  }

  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  controls.addEventListener("change", requestRenderIfNotRequested);
  window.addEventListener("resize", requestRenderIfNotRequested);
};
</script>
<style scoped lang="css">
#c,
#d {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
