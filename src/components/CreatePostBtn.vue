<template>
  <button
    class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
    @click="handleCreatePost"
  >
    创建新文章
  </button>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

// 跳转至创建页面
const handleCreatePost = () => {
  router.push({ name: "create" });
};
</script>
