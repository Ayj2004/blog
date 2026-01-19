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
      <PostDetail v-if="post" :post="post" />

      <!-- 文章不存在 -->
      <div v-if="!loading && !error && !post" class="text-center py-10">
        <p class="text-gray-500">该文章不存在或已被删除</p>
        <router-link to="/" class="text-primary mt-4 inline-block"
          >返回首页</router-link
        >
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Post } from "@/types";
import Layout from "@/components/Layout.vue";
import PostDetail from "@/components/PostDetail.vue";
import { usePosts } from "@/composables/usePosts";

// 接收路由参数（文章id）
const props = defineProps<{
  id: string;
}>();

const { loading, error, fetchPostById } = usePosts();
const post = ref<Post | null>(null);

// 页面挂载时加载文章详情
onMounted(async () => {
  const data = await fetchPostById(props.id);
  post.value = data;
});
</script>
