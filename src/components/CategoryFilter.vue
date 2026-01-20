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

    <!-- 动态分类按钮：修复事件绑定写法，让TS识别到函数调用 -->
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
      修复：将事件处理函数直接绑定，避免TS误判未调用
      --
    >
      @mouseenter="(e) => handleMouseEnter(e)" @mouseleave="(e) =>
      handleMouseLeave(e, category)" >
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
 * 显式标注函数类型，消除TS误判
 */
const handleMouseEnter: (e: MouseEvent) => void = (e) => {
  if (!e.target) return;
  const target = e.target as HTMLButtonElement;
  const hoverBg = window
    .getComputedStyle(target)
    .getPropertyValue("--hover-bg");
  target.style.backgroundColor = hoverBg;
};

/**
 * 显式标注函数类型，消除TS误判
 */
const handleMouseLeave: (e: MouseEvent, category: string) => void = (
  e,
  category
) => {
  if (!e.target) return;
  const target = e.target as HTMLButtonElement;
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
</script>
