<template>
  <div class="mb-8 flex flex-wrap gap-2">
    <button
      class="px-4 py-2 rounded-md transition-colors"
      :class="[
        activeCategory === 'all'
          ? 'bg-primary text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      ]"
      @click="handleSelectCategory('all')"
    >
      全部文章
    </button>
    <!-- 动态渲染分类标签 -->
    <button
      v-for="category in categories"
      :key="category"
      class="px-4 py-2 rounded-md transition-colors"
      :class="[
        activeCategory === category
          ? 'bg-primary text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      ]"
      @click="handleSelectCategory(category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

// 定义Props并直接解构使用，避免props变量未读取
const props = defineProps({
  // 所有分类列表
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
  // 当前选中的分类
  activeCategory: {
    type: String,
    required: true,
    default: "all",
  },
});

// 解构props属性（核心：让TS检测到props被使用）
const { categories, activeCategory } = props;

// 定义事件
const emit = defineEmits<{
  (e: "change", category: string): void;
}>();

// 处理分类选择
const handleSelectCategory = (category: string) => {
  emit("change", category);
};
</script>
