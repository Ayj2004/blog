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
      @mouseenter="handleMouseEnter"
      @mouseleave="(e) => handleMouseLeave(e, category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType, MouseEvent } from "vue";

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
 * 修复TS报错：处理鼠标进入事件（类型断言 + 全局getComputedStyle）
 */
const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
  // 1. 断言target是HTMLButtonElement，排除null
  const target = e.target as HTMLButtonElement;
  // 2. 使用全局window.getComputedStyle（而非this）
  const hoverBg = window
    .getComputedStyle(target)
    .getPropertyValue("--hover-bg");
  target.style.backgroundColor = hoverBg;
};

/**
 * 修复TS报错：处理鼠标离开事件
 */
const handleMouseLeave = (
  e: MouseEvent<HTMLButtonElement>,
  category: string
) => {
  const target = e.target as HTMLButtonElement;
  // 仅当未选中时恢复浅色系背景
  if (activeCategory !== category) {
    target.style.backgroundColor = getRandomColor(category, "light");
  }
};

/**
 * 基于分类名生成固定的随机颜色（同一分类始终返回相同颜色）
 * @param category 分类名称
 * @param type 颜色类型：light(未选中浅色) | dark(选中深色) | hover(hover浅深色)
 * @returns 十六进制颜色值
 */
const getRandomColor = (
  category: string,
  type: "light" | "dark" | "hover"
): string => {
  // 步骤1：基于分类名字符串生成固定哈希值
  const hash = category.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc; // 转为32位整数
  }, 0);

  // 步骤2：HSL模式生成颜色（视觉更友好）
  const hue = hash % 360; // 色相0-360
  const saturation = 70; // 饱和度70%

  let lightness = 90; // 未选中-浅色系
  if (type === "dark") lightness = 40; // 选中-深色系
  if (type === "hover") lightness = 80; // hover-略深的浅色系

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
</script>
