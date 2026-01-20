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
        // 未选中态：随机浅色系背景 + 深色文字
        backgroundColor:
          activeCategory !== category
            ? getRandomColor(category, 'light')
            : getRandomColor(category, 'dark'),
        color: activeCategory === category ? '#ffffff' : '#333333',
        // hover态：浅色系加深一点
        '--hover-bg': getRandomColor(category, 'hover'),
      }"
      @mouseenter="
        (e) =>
          (e.target.style.backgroundColor = getComputedStyle(
            e.target
          ).getPropertyValue('--hover-bg'))
      "
      @mouseleave="
        (e) => {
          if (activeCategory !== category) {
            e.target.style.backgroundColor = getRandomColor(category, 'light');
          }
        }
      "
    >
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
 * 核心：基于分类名生成固定的随机颜色（同一分类始终返回相同颜色）
 * @param category 分类名称
 * @param type 颜色类型：light(未选中浅色) | dark(选中深色) | hover(hover浅深色)
 * @returns 十六进制颜色值
 */
const getRandomColor = (
  category: string,
  type: "light" | "dark" | "hover"
): string => {
  // 步骤1：基于分类名字符串生成固定哈希值（保证同一分类哈希不变）
  const hash = category.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc; // 转为32位整数
  }, 0);

  // 步骤2：基于哈希生成随机RGB值（保证颜色分布均匀）
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  // 步骤3：根据类型调整颜色深浅（避免太暗/太亮）
  const adjustColor = (val: number, factor: number) => {
    const res = Math.round(val * factor);
    return Math.min(255, Math.max(0, res));
  };

  switch (type) {
    case "light": // 未选中：浅色系（RGB值放大，接近白色）
      return `rgb(${adjustColor(r, 1.8)}, ${adjustColor(g, 1.8)}, ${adjustColor(
        b,
        1.8
      )})`;
    case "dark": // 选中：深色系（RGB值缩小，更饱和）
      return `rgb(${adjustColor(r, 0.7)}, ${adjustColor(g, 0.7)}, ${adjustColor(
        b,
        0.7
      )})`;
    case "hover": // hover：比light深一点
      return `rgb(${adjustColor(r, 1.6)}, ${adjustColor(g, 1.6)}, ${adjustColor(
        b,
        1.6
      )})`;
  }
};
</script>
