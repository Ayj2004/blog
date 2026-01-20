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

      <!-- 分类筛选 + 文章列表（仅加载完成后显示） -->
      <div v-if="!loading && !error">
        <!-- 分类筛选组件 -->
        <CategoryFilter
          :categories="allCategories"
          :active-category="activeCategory"
          @change="handleCategoryChange"
        />

        <!-- 文章列表 -->
        <div
          v-if="filteredPosts.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <router-link
            v-for="post in filteredPosts"
            :key="post.id"
            :to="{ name: 'detail', params: { id: post.id } }"
            class="block"
          >
            <PostCard :post="post" />
          </router-link>
        </div>

        <!-- 筛选后空状态 -->
        <div v-if="!filteredPosts.length" class="text-center py-10">
          <p class="text-gray-500 mb-4">
            {{
              activeCategory === "all"
                ? "暂无文章，快去创建吧～"
                : `暂无${activeCategory}分类的文章`
            }}
          </p>
          <CreatePostBtn />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import Layout from "@/components/Layout.vue";
import PostCard from "@/components/PostCard.vue";
import CreatePostBtn from "@/components/CreatePostBtn.vue";
import CategoryFilter from "@/components/CategoryFilter.vue"; // 引入分类筛选组件
import { usePosts } from "@/composables/usePosts";

const { posts, loading, error, fetchPosts } = usePosts();

// 页面挂载时加载文章列表
onMounted(() => {
  fetchPosts();
});

// 分类筛选相关状态
const activeCategory = ref<string>("all"); // 默认选中全部

// 提取所有不重复的分类（去重 + 过滤空值）
const allCategories = computed(() => {
  const categorySet = new Set(
    posts.value.map((post) => post.category || "未分类").filter(Boolean)
  );
  return Array.from(categorySet);
});

// 根据选中的分类筛选文章
const filteredPosts = computed(() => {
  if (activeCategory.value === "all") {
    return posts.value; // 全部文章
  }
  // 筛选指定分类的文章（兼容未分类）
  return posts.value.filter((post) => {
    const postCategory = post.category || "未分类";
    return postCategory === activeCategory.value;
  });
});

// 处理分类切换
const handleCategoryChange = (category: string) => {
  activeCategory.value = category;
};
</script>
