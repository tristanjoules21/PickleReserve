import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/login.vue";
import Registration from "../views/registration.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/register",
    component: Registration
  },
  {
    path: "/login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;