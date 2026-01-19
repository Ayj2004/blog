<template>
  <div v-if="post" class="post-detail max-w-3xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
    <div class="flex flex-wrap justify-between gap-2 text-gray-500 mb-6">
      <span>分类：{{ post.category || "未分类" }}</span>
      <span>作者：{{ post.author || "匿名作者" }}</span>
      <span>发布时间：{{ post.createTime }}</span>
      <span>更新时间：{{ post.updateTime }}</span>
    </div>
    <img
      :src="post.cover"
      :alt="post.title"
      class="w-full h-64 object-cover rounded mb-6"
    />
    <div class="prose max-w-none" v-html="post.content"></div>
  </div>
  <div v-else class="text-center py-10">文章不存在</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Post } from "@/types";
import { usePosts } from "@/composables/usePosts";

// 修正 props 定义：id 为可选（兼容传入 post 的场景），类型兼容 string/number
const props = defineProps<{
  id?: string | number;
  post?: Post;
}>();

const { getPostById } = usePosts();
const post = ref<Post | null>(props.post || null);

onMounted(() => {
  // 仅当未传入 post 且传入 id 时，调用 getPostById
  if (!post.value && props.id) {
    const targetPost = getPostById(props.id);
    post.value = targetPost || null;
  }
});
</script>

<style scoped>
.post-detail {
  line-height: 1.8;
}
.prose {
  color: #333;
}
.prose p {
  margin-bottom: 1rem;
}
</style>
