<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <img :src="post.cover" alt="文章封面" class="w-full h-48 object-cover" />
    <div class="p-6">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm text-secondary bg-gray-100 px-2 py-1 rounded">{{
          post.category
        }}</span>
        <span class="text-sm text-gray-500">{{ post.createTime }}</span>
      </div>
      <h3
        class="text-xl font-semibold mb-2 hover:text-primary transition-colors"
      >
        <router-link :to="{ name: 'detail', params: { id: post.id } }">
          {{ post.title }}
        </router-link>
      </h3>
      <p class="text-gray-600 mb-4 line-clamp-2">{{ post.excerpt }}</p>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">作者：{{ post.author }}</span>
        <router-link
          :to="{ name: 'detail', params: { id: post.id } }"
          class="btn btn-primary text-sm"
        >
          阅读全文
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "@/types";
defineProps<{
  post: Post;
}>();
</script>
