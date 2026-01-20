<template>
  <Layout :title="post?.title || '文章详情 | VueBlog'">
    <div class="max-w-3xl mx-auto py-8 px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-10">
        <span class="inline-block animate-spin mr-2">🔄</span>
        加载中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>

      <!-- 文章详情 -->
      <PostDetail v-if="post" :id="post.id" :post="post" />

      <!-- 文章不存在 -->
      <div v-if="!loading && !error && !post" class="text-center py-10">
        <p class="text-gray-500">该文章不存在或已被删除</p>
        <router-link
          to="/"
          class="text-primary mt-4 inline-block hover:underline"
        >
          返回首页
        </router-link>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Post } from "@/types";
import Layout from "@/components/Layout.vue";
import PostDetail from "@/components/PostDetail.vue";
import { usePosts } from "@/composables/usePosts";

// 获取路由参数
const route = useRoute();
const postId = ref<string | number>(route.params.id as string);

const { loading, error, fetchPostById } = usePosts();
const post = ref<Post | null>(null);

// 加载文章详情
onMounted(async () => {
  if (postId.value) {
    const result = await fetchPostById(postId.value as string);
    if (result.success && result.data) {
      post.value = result.data;
    } else {
      post.value = null;
    }
  }
});
</script>
