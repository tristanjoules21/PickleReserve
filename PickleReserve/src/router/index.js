import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import DashboardView from "../views/admin/AdminCourtsView.vue";
import AdminView from "../views/admin/AdminDashboardView.vue";
import AdminReservationView from "../views/admin/AdminReservationView.vue";
import AdminCustomerView from "../views/admin/AdminCustomerView.vue";
import AdminSettingsView from "../views/admin/AdminSettingsView.vue";
import BookingPageView from "../views/user/BookingPageView.vue";
import BookingFormView from "../views/user/BookingFormView.vue";
import { getAuthToken, getAuthUser } from "../services/auth";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: LoginView
  },
  {
    path: "/register",
    component: RegisterView
  },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin",
    component: AdminView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/book",
    name: "Booking",
    component: BookingPageView
  },
  {
    path: "/booking-form",
    name: "BookingForm",
    component: BookingFormView
  },
  {
    path: "/app",
    redirect: "/dashboard"
  },
  {
    path: "/bookings",
    redirect: "/dashboard"
  },
  {
    path: "/courts",
    redirect: "/dashboard"
  },
  {
    path: "/customers",
    component: AdminCustomerView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/notifications",
    redirect: "/dashboard"
  },
  {
    path: "/profile",
    redirect: "/dashboard"
  },
  {
    path: "/reservations",
    component: AdminReservationView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/settings",
    component: AdminSettingsView,
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (!to.meta.requiresAdmin) return true;

  const user = getAuthUser();
  if (getAuthToken() && String(user?.role).toUpperCase() === "ADMIN") return true;

  return { path: "/login", query: { redirect: to.fullPath } };
});

export default router;