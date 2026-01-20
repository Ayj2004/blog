<template>
  <div class="mb-8 flex flex-wrap gap-2">
    <!-- 全部文章按钮 -->
    <button
      class="px-6 py-3 rounded-md transition-colors text-base"
      :class="[
        activeCategory === 'all'
          ? 'bg-primary text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      ]"
      @click="handleSelectCategory('all')"
    >
      全部文章
    </button>

    <!-- 动态分类按钮：直接绑定函数，移除箭头函数（减少TS分析复杂度） -->
    <button
      v-for="category in categories"
      :key="category"
      class="px-4 py-2 rounded-md transition-colors text-sm"
      :style="{
        backgroundColor:
          activeCategory !== category
            ? getRandomColor(category, 'light')
            : getRandomColor(category, 'dark'),
        color: activeCategory === category ? '#ffffff' : '#333333',
        '--hover-bg': getRandomColor(category, 'hover'),
      }"
      @click="handleSelectCategory(category)"
      <!--
      直接绑定函数，通过data-属性传递category（替代参数传递）
      --
    >
      @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
      :data-category="category" >
      {{ category }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

// 定义Props
const props = defineProps({
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
  activeCategory: {
    type: String,
    required: true,
    default: "all",
  },
});

const { categories, activeCategory } = props;

// 定义事件
const emit = defineEmits<{
  (e: "change", category: string): void;
}>();

// 处理分类选择
const handleSelectCategory = (category: string) => {
  emit("change", category);
};

/**
 * 从DOM元素获取data-category，替代参数传递
 * 显式关联DOM操作，让TS感知函数被实际调用
 */
const handleMouseEnter = (e: MouseEvent) => {
  const target = e.target as HTMLButtonElement;
  const hoverBg = window
    .getComputedStyle(target)
    .getPropertyValue("--hover-bg");
  target.style.backgroundColor = hoverBg;
};

/**
 * 从data-category获取分类名，消除参数传递导致的TS误判
 */
const handleMouseLeave = (e: MouseEvent) => {
  const target = e.target as HTMLButtonElement;
  const category = target.dataset.category || ""; // 从data属性取分类名
  target.style.backgroundColor =
    activeCategory === category
      ? getRandomColor(category, "dark")
      : getRandomColor(category, "light");
};

/**
 * 基于分类名生成固定的随机颜色
 */
const getRandomColor = (
  category: string,
  type: "light" | "dark" | "hover"
): string => {
  if (!category) return "#f5f5f5"; // 兜底空分类
  const hash = category.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc;
  }, 0);

  const hue = hash % 360;
  const saturation = 70;
  const lightnessMap = {
    light: 90,
    dark: 40,
    hover: 80,
  };

  return `hsl(${hue}, ${saturation}%, ${lightnessMap[type]}%)`;
};

// 关键：显式暴露函数，让TS感知函数被外部（模板）引用
defineExpose({
  handleMouseEnter,
  handleMouseLeave,
  handleSelectCategory,
});
</script>
