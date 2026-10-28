import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import DashboardView from "../views/admin/AdminCourtsView.vue";
import AdminView from "../views/admin/AdminDashboardView.vue";
import AdminReservationView from "../views/admin/AdminReservationView.vue";
import AdminCustomerView from "../views/admin/AdminCustomerView.vue";
import BookingPageView from "../views/user/BookingPageView.vue";
import BookingFormView from "../views/user/BookingFormView.vue";

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
    component: DashboardView
  },
  {
    path: "/admin",
    component: AdminView
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
    component: AdminCustomerView
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
    component: AdminReservationView
  },
  {
    path: "/settings",
    redirect: "/dashboard"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;