<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary"
            >VueBlog</router-link
          >
        </div>
        <div class="flex items-center space-x-6">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary transition-colors"
            :class="{ 'text-primary font-medium': $route.name === 'home' }"
          >
            首页
          </router-link>
          <router-link
            to="/create"
            class="text-gray-700 hover:text-primary transition-colors"
            :class="{ 'text-primary font-medium': $route.name === 'create' }"
          >
            创建文章
          </router-link>
          <!-- 编辑页高亮（可选，因为编辑页是动态路由，这里仅做辅助） -->
          <router-link
            v-if="$route.name === 'edit'"
            to=""
            class="text-primary font-medium cursor-default"
          >
            编辑文章
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>
