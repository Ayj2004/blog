import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DetailView from "@/views/DetailView.vue";
import CreateView from "@/views/CreateView.vue";
import EditView from "@/views/EditView.vue"; // 新增编辑页

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/detail/:id",
      name: "detail",
      component: DetailView,
      props: true,
    },
    {
      path: "/create",
      name: "create",
      component: CreateView,
    },
    {
      path: "/edit/:id", // 新增编辑路由
      name: "edit",
      component: EditView,
      props: true,
    },
    // 404 路由
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
