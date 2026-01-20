<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
  >
    <img :src="post.cover" :alt="post.title" class="w-full h-48 object-cover" />
    <div class="p-4">
      <div class="text-sm text-gray-500 mb-2">
        {{ post.category || "未分类" }}
      </div>
      <h3 class="text-xl font-bold mb-2 line-clamp-1">{{ post.title }}</h3>
      <p class="text-gray-600 mb-4 line-clamp-2">
        {{ post.summary || post.excerpt || "暂无摘要" }}
      </p>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ post.author || "匿名作者" }}</span>
        <span>{{ post.createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "@/types";

// 定义Props
defineProps<{
  post: Post;
}>();
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
