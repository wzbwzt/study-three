import { createApp, Plugin } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import VueHead from "vue-head";

const app = createApp(App);
app.use(router as Plugin);
app.use(VueHead);
app.mount("#app");
