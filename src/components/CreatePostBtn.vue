<template>
  <button class="btn btn-primary mt-4" @click="handleCreatePost">
    创建新文章
  </button>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

// 点击事件：可根据需求跳转至创建页面或打开弹窗
const handleCreatePost = () => {
  // 跳转至创建文章页面
  router.push({ name: "create" });
};
</script>
