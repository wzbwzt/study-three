import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Base from "../view/base/Base.vue";
import Responsive from "../view/base/Responsive.vue";
import SceneGraph from "../view/base/SceneGraph.vue";
import SceneGraphTank from "../view/base/SceneGraphTank.vue";
import Texture from "../view/base/Texture.vue";
import LighterAmbient from "../view/base/LighterAmbient.vue";
import LighterDirect from "../view/base/LighterDirect.vue";
import Camera from "../view/base/Camera.vue";
import Shadow from "../view/base/Shadow.vue";
import ShadowDirectLight from "../view/base/ShadowDirectLighter.vue";
import Fog from "../view/base/Fog.vue";
import RenderTarget from "../view/base/RenderTarget.vue";
import BufferGeometry from "../view/base/BufferGeometry.vue";
import MuchObjsOptimize from "../view/base/MuchObjsOptimize.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/base", component: Base },
  { path: "/responsive", component: Responsive },
  { path: "/scene_graph/sun_moon_earth", component: SceneGraph },
  { path: "/scene_graph/tank", component: SceneGraphTank },
  { path: "/texture", component: Texture },
  { path: "/lighter/Ambient", component: LighterAmbient },
  { path: "/lighter/direct", component: LighterDirect },
  { path: "/camera", component: Camera },
  { path: "/shadow", component: Shadow },
  { path: "/shadow/directLight", component: ShadowDirectLight },
  { path: "/fog", component: Fog },
  { path: "/renderTarget", component: RenderTarget },
  { path: "/bufferGeometry", component: BufferGeometry },
  { path: "/muchObjsOptimize", component: MuchObjsOptimize },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
