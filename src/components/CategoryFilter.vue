<template>
  <div class="mb-8 flex flex-wrap gap-2">
    <!-- 全部文章按钮 -->
    <button
      class="px-4 py-2 rounded-md transition-colors duration-200"
      :style="{
        backgroundColor:
          activeCategory === 'all'
            ? '#165DFF' // 全部按钮固定主色
            : '#f5f5f5',
        color: activeCategory === 'all' ? '#ffffff' : '#333333',
        border: activeCategory === 'all' ? 'none' : '1px solid #e5e7eb',
      }"
      @click="handleSelectCategory('all')"
    >
      全部文章
    </button>

    <!-- 动态分类按钮（每个分类独立颜色） -->
    <button
      v-for="category in categories"
      :key="category"
      class="px-4 py-2 rounded-md transition-colors duration-200"
      :style="{
        // 选中态：深色主色；默认态：浅色背景
        backgroundColor:
          activeCategory === category
            ? getCategoryColor(category, 'active')
            : getCategoryColor(category, 'default'),
        // 文字颜色适配背景
        color: activeCategory === category ? '#ffffff' : '#333333',
        // hover态颜色（基于主色生成）
        '--hover-bg': getCategoryColor(category, 'hover'),
        border: activeCategory === category ? 'none' : '1px solid #e5e7eb',
      }"
      @mouseenter="(e) => handleHover(e, 'enter')"
      @mouseleave="(e) => handleHover(e, 'leave', category)"
      @click="handleSelectCategory(category)"
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
 * 基于分类名生成固定的唯一颜色（避免刷新后变色）
 * @param category 分类名称
 * @param type 颜色类型（default/active/hover）
 * @returns 十六进制颜色值
 */
const getCategoryColor = (
  category: string,
  type: "default" | "active" | "hover"
): string => {
  // 基于分类名生成固定hash值（核心：保证同一分类颜色不变）
  const hash = category.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc; // 转为32位整数
  }, 0);

  // 生成固定色相（0-360），避免颜色过于相近
  const hue = Math.abs(hash) % 360;
  // 不同状态的饱和度/亮度配置
  const colorConfig = {
    default: `hsl(${hue}, 30%, 95%)`, // 浅色背景（默认态）
    active: `hsl(${hue}, 70%, 50%)`, // 深色主色（选中态）
    hover: `hsl(${hue}, 40%, 90%)`, // 过渡色（hover态）
  };

  return colorConfig[type];
};

/**
 * 处理鼠标hover事件（避免TS6133报错：显式关联模板调用）
 * @param e 鼠标事件
 * @param action 操作类型（enter/leave）
 * @param category 分类名称
 */
const handleHover = (
  e: MouseEvent,
  action: "enter" | "leave",
  category?: string
) => {
  const target = e.target as HTMLButtonElement;
  if (!target) return;

  if (action === "enter") {
    // 鼠标移入：使用hover色
    const hoverBg = window
      .getComputedStyle(target)
      .getPropertyValue("--hover-bg");
    target.style.backgroundColor = hoverBg;
  } else if (action === "leave" && category) {
    // 鼠标移出：恢复默认/选中色
    target.style.backgroundColor =
      activeCategory === category
        ? getCategoryColor(category, "active")
        : getCategoryColor(category, "default");
  }
};

// 显式暴露函数（关键：消除TS6133 "未使用" 报错）
defineExpose({
  handleSelectCategory,
  handleHover,
  getCategoryColor,
});
</script>
