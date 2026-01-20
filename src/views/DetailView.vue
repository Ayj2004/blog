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

      <!-- 文章操作区 -->
      <div v-if="post" class="mb-6 flex gap-4">
        <router-link
          :to="{ name: 'edit', params: { id: post.id } }"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          编辑文章
        </router-link>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          @click="handleDelete"
        >
          删除文章
        </button>
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
import { useRoute, useRouter } from "vue-router";
import type { Post } from "@/types";
import Layout from "@/components/Layout.vue";
import PostDetail from "@/components/PostDetail.vue";
import { usePosts } from "@/composables/usePosts";

// 获取路由参数
const route = useRoute();
const router = useRouter();
const postId = ref<string | number>(route.params.id as string);

const { loading, error, fetchPostById, deletePost } = usePosts();
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

// 处理删除逻辑
const handleDelete = async () => {
  if (!confirm("确定要删除这篇文章吗？删除后无法恢复！")) {
    return;
  }

  const result = await deletePost(postId.value as string);
  if (result.success) {
    alert("文章删除成功！");
    router.push("/");
  } else {
    alert(`删除失败：${result.error}`);
  }
};
</script>
