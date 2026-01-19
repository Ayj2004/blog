import { ref } from "vue";
import type { Post } from "@/types";
import { format } from "date-fns";

// 模拟文章数据（实际项目可替换为接口请求）
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Vue 3 组合式 API 实战指南",
    excerpt:
      "详细讲解 Vue 3 组合式 API 的使用场景和最佳实践，让你的代码更简洁易维护。",
    content: `
      # Vue 3 组合式 API 实战指南
      ## 一、什么是组合式 API
      组合式 API（Composition API）是 Vue 3 推出的新特性，旨在解决大型组件中逻辑复用和代码组织的问题。

      ## 二、核心 API 使用
      ### 1. ref 和 reactive
      ref 用于定义基本类型响应式数据，reactive 用于定义对象类型响应式数据：
      \`\`\`vue
      <script setup>
      import { ref, reactive } from 'vue'
      const count = ref(0)
      const user = reactive({ name: '张三', age: 20 })
      </script>
      \`\`\`

      ## 三、实战场景
      组合式 API 特别适合拆分复杂的业务逻辑，比如表单验证、数据请求等。
    `,
    cover: "https://picsum.photos/800/400?random=1",
    category: "前端",
    createTime: format(new Date("2024-02-01"), "yyyy-MM-dd HH:mm"),
    author: "前端开发者",
  },
  {
    id: 2,
    title: "Tailwind CSS 快速上手",
    excerpt:
      "从零开始学习 Tailwind CSS，无需编写自定义 CSS 即可快速构建美观的界面。",
    content: `
      # Tailwind CSS 快速上手
      ## 一、安装与配置
      通过 npm 安装 Tailwind CSS：
      \`\`\`bash
      npm install -D tailwindcss postcss autoprefixer
      npx tailwindcss init -p
      \`\`\`

      ## 二、核心特性
      Tailwind CSS 采用原子化 CSS 理念，每个类只对应一个样式，比如：
      - \`bg-gray-50\`：背景色浅灰
      - \`text-primary\`：文字主色调
      - \`px-4\`：水平内边距 16px

      ## 三、响应式设计
      只需添加屏幕前缀即可实现响应式：
      \`\`\`html
      <div class="w-16 md:w-32 lg:w-64">响应式宽度</div>
      \`\`\`
    `,
    cover: "https://picsum.photos/800/400?random=2",
    category: "CSS",
    createTime: format(new Date("2024-02-10"), "yyyy-MM-dd HH:mm"),
    author: "UI 工程师",
  },
  {
    id: 3,
    title: "Vite 性能优化技巧",
    excerpt: "掌握 Vite 的核心优化手段，让你的 Vue 项目启动更快、打包更小。",
    content: `
      # Vite 性能优化技巧
      ## 一、依赖预构建
      Vite 会自动预构建第三方依赖，可通过 \`optimizeDeps\` 配置自定义预构建：
      \`\`\`ts
      // vite.config.ts
      export default defineConfig({
        optimizeDeps: {
          include: ['axios', 'lodash']
        }
      })
      \`\`\`

      ## 二、代码分割
      使用动态导入实现代码分割，减少首屏加载体积：
      \`\`\`vue
      <script setup>
      const loadComponent = async () => {
        const { default: Component } = await import('./HeavyComponent.vue')
      }
      </script>
      \`\`\`

      ## 三、静态资源处理
      对图片、字体等静态资源进行压缩，可配合 vite-plugin-imagemin 插件使用。
    `,
    cover: "https://picsum.photos/800/400?random=3",
    category: "构建工具",
    createTime: format(new Date("2024-02-18"), "yyyy-MM-dd HH:mm"),
    author: "架构师",
  },
];

// 获取所有文章
export const usePosts = () => {
  const posts = ref<Post[]>(mockPosts);

  // 根据 ID 获取单篇文章
  const getPostById = (id: number) => {
    return posts.value.find((post) => post.id === id) || null;
  };

  // 根据分类筛选文章
  const filterPostsByCategory = (category: string) => {
    if (category === "全部") return posts.value;
    return posts.value.filter((post) => post.category === category);
  };

  return {
    posts,
    getPostById,
    filterPostsByCategory,
  };
};
