vue-blog-system/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│ ├── main.ts
│ ├── App.vue
│ ├── index.css
│ ├── router/
│ │ └── index.ts // 路由配置
│ ├── components/
│ │ ├── Layout.vue // 全局布局（导航+页脚+内容区）
│ │ ├── Navbar.vue // 导航栏
│ │ ├── Footer.vue // 页脚
│ │ ├── PostCard.vue // 文章卡片组件
│ │ └── PostDetail.vue // 文章详情组件
│ ├── composables/
│ │ └── usePosts.ts // 文章数据逻辑（模拟接口）
│ ├── types/
│ │ └── index.ts // 类型定义
│ └── views/
│ ├── HomeView.vue // 首页（文章列表）
│ └── DetailView.vue // 文章详情页
└── public/
├── favicon.ico
└── assets/
└── images/ // 可放文章封面图（示例用占位图）
