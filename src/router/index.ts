import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DefaultLayout from "../layout/default.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProductsView from "../views/ProductsView.vue";
import ShopView from "../views/ShopView.vue";
import CartView from "../views/CartView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import OrderView from "../views/OrderView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: DashboardView,
        meta: { requiresAuth: true },
      },
      {
        path: "Products",
        name: "Products",
        component: ProductsView,
        meta: { requiresAuth: true },
      },
      {
        path: "Shop",
        name: "Shop",
        component: ShopView,
        meta: { requiresAuth: true },
      },
      {
        path: "Cart",
        name: "Cart",
        component: CartView,
        meta: { requiresAuth: true },
      },
      {
        path: "Checkout",
        name: "Checkout",
        component: CheckoutView,
        meta: { requiresAuth: true },
      },
      {
        path: "Order",
        name: "Order",
        component: OrderView,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("accessToken");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
