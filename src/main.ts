import { createApp, Plugin } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router as Plugin);
app.mount("#app");
