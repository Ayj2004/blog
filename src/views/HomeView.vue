<template>
  <Layout title="首页 | VueBlog">
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-10">
        <span class="inline-block animate-spin mr-2">🔄</span>
        加载中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>

      <!-- 文章列表 -->
      <div
        v-if="posts.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !error && !posts.length" class="text-center py-10">
        <p class="text-gray-500">暂无文章，快去创建吧～</p>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Layout from "@/components/Layout.vue";
import PostCard from "@/components/PostCard.vue";
import { usePosts } from "@/composables/usePosts";

const { posts, loading, error, fetchPosts } = usePosts();

// 页面挂载时加载文章列表
onMounted(() => {
  fetchPosts();
});
</script>
