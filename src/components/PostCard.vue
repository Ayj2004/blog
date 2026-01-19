<template>
  <div class="post-card border rounded-lg p-4 shadow-sm">
    <img
      :src="post.cover"
      :alt="post.title"
      class="w-full h-48 object-cover rounded mb-3"
    />
    <!-- 可选字段添加默认值 -->
    <div class="text-sm text-gray-500 mb-2">
      {{ post.category || "未分类" }}
    </div>
    <h3 class="text-xl font-bold mb-2">{{ post.title }}</h3>
    <!-- 优先使用 excerpt，无则使用 summary，再无则显示默认文本 -->
    <p class="text-gray-600 mb-4 line-clamp-2">
      {{ post.excerpt || post.summary || "暂无摘要" }}
    </p>
    <div class="flex justify-between items-center text-sm text-gray-500">
      <span>{{ post.author || "匿名作者" }}</span>
      <span>{{ post.createTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "@/types";

// 定义组件 props
defineProps<{
  post: Post;
}>();
</script>

<style scoped>
.post-card {
  transition: box-shadow 0.2s;
}
.post-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
