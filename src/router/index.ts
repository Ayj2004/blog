import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DetailView from "@/views/DetailView.vue";
import CreateView from "@/views/CreateView.vue"; // 引入创建页面

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
    // 新增创建文章路由
    {
      path: "/create",
      name: "create",
      component: CreateView,
    },
  ],
});

export default router;
