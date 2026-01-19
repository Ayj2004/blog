<template>
  <div class="bg-white rounded-lg shadow-md p-6 md:p-8">
    <div v-if="!post" class="text-center py-10">
      <p class="text-xl text-gray-500">文章不存在</p>
      <router-link to="/" class="btn btn-primary mt-4 inline-block"
        >返回首页</router-link
      >
    </div>
    <div v-else>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ post.title }}</h1>
      <div class="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
        <span>分类：{{ post.category }}</span>
        <span>发布时间：{{ post.createTime }}</span>
        <span>作者：{{ post.author }}</span>
      </div>
      <img
        :src="post.cover"
        alt="文章封面"
        class="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
      />
      <div class="prose max-w-none">
        <!-- 简单解析 markdown 换行和标题（实际项目可集成 markdown-it） -->
        <div v-html="formatContent(post.content)"></div>
      </div>
      <div class="mt-8">
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "@/types";
import { usePosts } from "@/composables/usePosts";

const props = defineProps<{
  id: number;
}>();

const { getPostById } = usePosts();
// 关键修改：给 post 变量显式添加 Post 类型注解，让 TS 识别到 Post 被使用
const post: Post | null = getPostById(Number(props.id));

// 简单格式化 markdown 内容（仅示例，复杂场景用 markdown-it）
const formatContent = (content: string) => {
  return content
    .replace(/\n/g, "<br>")
    .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold my-2">$1</h3>')
    .replace(
      /`{3}([\s\S]*?)`{3}/g,
      '<pre class="bg-gray-100 p-4 rounded my-3"><code>$1</code></pre>'
    )
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
};
</script>
