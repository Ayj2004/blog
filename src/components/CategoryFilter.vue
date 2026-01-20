<template>
  <div class="mb-8 flex flex-wrap gap-2">
    <!-- 全部文章按钮（更大尺寸） -->
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

    <!-- 动态渲染分类标签（更小尺寸 + 随机颜色） -->
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
      恢复点击事件
      --
    >
      @mouseenter="handleMouseEnter" @mouseleave="(e) => handleMouseLeave(e,
      category)" >
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
 * 处理鼠标进入事件（兼容非泛型MouseEvent）
 */
const handleMouseEnter = (e: MouseEvent) => {
  if (!e.target) return;
  const target = e.target as HTMLButtonElement;
  const hoverBg = window
    .getComputedStyle(target)
    .getPropertyValue("--hover-bg");
  target.style.backgroundColor = hoverBg;
};

/**
 * 处理鼠标离开事件
 */
const handleMouseLeave = (e: MouseEvent, category: string) => {
  if (!e.target) return;
  const target = e.target as HTMLButtonElement;
  // 选中状态保留深色，未选中恢复浅色
  target.style.backgroundColor =
    activeCategory === category
      ? getRandomColor(category, "dark")
      : getRandomColor(category, "light");
};

/**
 * 基于分类名生成固定的随机颜色（同一分类始终返回相同颜色）
 */
const getRandomColor = (
  category: string,
  type: "light" | "dark" | "hover"
): string => {
  // 生成固定哈希值（保证同一分类颜色不变）
  const hash = category.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc;
  }, 0);

  const hue = hash % 360; // 固定色相
  const saturation = 70; // 固定饱和度
  // 不同状态的亮度
  const lightnessMap = {
    light: 90,
    dark: 40,
    hover: 80,
  };

  return `hsl(${hue}, ${saturation}%, ${lightnessMap[type]}%)`;
};
</script>
