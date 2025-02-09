import { createWebHashHistory, createRouter } from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import PresencePage from "@/pages/PresencePage.vue";
import LoginPage from "@/pages/LoginPage.vue";

const routes = [
    {
        path: "/",
        name: "LoginPage",
        component: LoginPage,
    },
    {
        // path: "/",
        path: "/homepage",
        name: "HomePage",
        component: HomePage,
    },
    {
        path: "/presencepage",
        name: "PresencePage",
        component: PresencePage,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
