<template>
  <Layout>
    <div class="container">
      <!-- 分类筛选 -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            class="btn"
            :class="{
              'btn-primary': activeCategory === category,
              'bg-gray-200': activeCategory !== category,
            }"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Layout from "@/components/Layout.vue";
import PostCard from "@/components/PostCard.vue";
import { usePosts } from "@/composables/usePosts";
import type { Post } from "@/types";

const { posts, filterPostsByCategory } = usePosts();

// 提取所有分类（去重）
const categories = ref<string[]>([
  "全部",
  ...Array.from(new Set(posts.value.map((p) => p.category))),
]);
const activeCategory = ref<string>("全部");

// 筛选后的文章
const filteredPosts = computed<Post[]>(() => {
  return filterPostsByCategory(activeCategory.value);
});
</script>
