import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);
app.use(VCalendar, {});
app.use(pinia);
app.mount("#app");
