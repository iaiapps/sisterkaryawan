import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

//bootstrap icon
import "bootstrap-icons/font/bootstrap-icons.css";
// createApp(App).mount("#app");
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
