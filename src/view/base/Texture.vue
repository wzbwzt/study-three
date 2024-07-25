<template>
    <div>
        <canvas id="c" title="texture"></canvas>
        <canvas id="d" title="texture"></canvas>
        <canvas id="e" title="gui"></canvas>
        <div id="loading">
            <div class="progress"><div class="progressbar"></div></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { onMounted } from "vue";
onMounted(() => {
    base();
    base2();
    base3();
});

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

const base = () => {
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

    const fov = 75;
    const aspect = 2; // 相机默认值
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = <any>[]; // just an array we can use to rotate the cubes
    const loader = new THREE.TextureLoader();

    const texture = loader.load("https://threejs.org/manual/examples/resources/images/wall.jpg", (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture }); //不受灯光影响的材质
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cubes.push(cube);
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    //动画旋转
    {
        const render = (time: number) => {
            time *= 0.001; // 将时间单位变为秒

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            cubes.forEach((cube: any, ndx: number) => {
                const speed = 0.2 + ndx * 0.1;
                const rot = time * speed;

                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
};

const base2 = () => {
    const canvas = document.querySelector("#d");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

    const fov = 75;
    const aspect = 2; // 相机默认值
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = <any>[]; // just an array we can use to rotate the cubes
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    function loadColorTexture(path: string) {
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }
    const materials = [
        new THREE.MeshBasicMaterial({
            map: loadColorTexture("https://threejs.org/manual/examples/resources/images/flower-1.jpg"),
        }),
        new THREE.MeshBasicMaterial({
            map: loadColorTexture("https://threejs.org/manual/examples/resources/images/flower-2.jpg"),
        }),
        new THREE.MeshBasicMaterial({
            map: loadColorTexture("https://threejs.org/manual/examples/resources/images/flower-3.jpg"),
        }),
        new THREE.MeshBasicMaterial({
            map: loadColorTexture("https://threejs.org/manual/examples/resources/images/flower-4.jpg"),
        }),
        new THREE.MeshBasicMaterial({
            map: loadColorTexture("https://threejs.org/manual/examples/resources/images/flower-5.jpg"),
        }),
        new THREE.MeshBasicMaterial({
            map: loadColorTexture("https://threejs.org/manual/examples/resources/images/flower-6.jpg"),
        }),
    ];

    const loadingElem = document.querySelector("#loading") as ParentNode;
    const progressBarElem = loadingElem.querySelector(".progressbar");

    loadManager.onLoad = () => {
        loadingElem.style.display = "none";
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
        cubes.push(cube); // 添加到我们要旋转的立方体数组中
    };
    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };

    //   const cube = new THREE.Mesh(geometry, materials);
    //   scene.add(cube);
    //   cubes.push(cube);

    //动画旋转
    {
        const render = (time: number) => {
            time *= 0.001; // 将时间单位变为秒

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            cubes.forEach((cube: any, ndx: number) => {
                const speed = 0.2 + ndx * 0.1;
                const rot = time * speed;

                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
};
const base3 = () => {
    const canvas = document.querySelector("#e");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement });

    const fov = 75;
    const aspect = 2; // 相机默认值
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = <any>[]; // just an array we can use to rotate the cubes
    const loader = new THREE.TextureLoader();

    const texture = loader.load("https://threejs.org/manual/examples/resources/images/wall.jpg", (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture }); //不受灯光影响的材质
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cubes.push(cube);
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    class DegRadHelper {
        private obj: any;
        private prop: string;

        constructor(obj: any, prop: string) {
            this.obj = obj;
            this.prop = prop;
        }

        get value(): number {
            return THREE.MathUtils.radToDeg(this.obj[this.prop]);
        }

        set value(v: number) {
            this.obj[this.prop] = THREE.MathUtils.degToRad(v);
        }
    }

    class StringToNumberHelper {
        private obj: any;
        private prop: string;
        constructor(obj: any, prop: string) {
            this.obj = obj;
            this.prop = prop;
        }
        get value() {
            return this.obj[this.prop];
        }
        set value(v) {
            this.obj[this.prop] = parseFloat(v);
        }
    }
    const wrapModes = {
        ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
        RepeatWrapping: THREE.RepeatWrapping,
        MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
    };
    function updateTexture() {
        texture.needsUpdate = true;
    }

    const gui = new GUI();
    gui.add(new StringToNumberHelper(texture, "wrapS"), "value", wrapModes)
        .name("texture.wrapS")
        .onChange(updateTexture);
    gui.add(new StringToNumberHelper(texture, "wrapT"), "value", wrapModes)
        .name("texture.wrapT")
        .onChange(updateTexture);
    gui.add(texture.repeat, "x", 0, 5, 0.01).name("texture.repeat.x");
    gui.add(texture.repeat, "y", 0, 5, 0.01).name("texture.repeat.y");
    gui.add(texture.offset, "x", -2, 2, 0.01).name("texture.offset.x");
    gui.add(texture.offset, "y", -2, 2, 0.01).name("texture.offset.y");
    gui.add(texture.center, "x", -0.5, 1.5, 0.01).name("texture.center.x");
    gui.add(texture.center, "y", -0.5, 1.5, 0.01).name("texture.center.y");
    gui.add(new DegRadHelper(texture, "rotation"), "value", -360, 360).name("texture.rotation");

    //动画旋转
    {
        const render = (time: number) => {
            time *= 0.001; // 将时间单位变为秒

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            cubes.forEach((cube: any, ndx: number) => {
                const speed = 0.2 + ndx * 0.1;
                const rot = time * speed;

                cube.rotation.x = rot;
                cube.rotation.y = rot;
            });

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
};
</script>
<style lang="css" scoped>
#c,
#d,
#e {
    width: 100%;
    height: 100%;
    display: block;
}
#loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
#loading .progress {
    margin: 1.5em;
    border: 1px solid white;
    width: 50vw;
}
#loading .progressbar {
    margin: 2px;
    background: white;
    height: 1em;
    transform-origin: top left;
    transform: scaleX(0);
}
</style>
