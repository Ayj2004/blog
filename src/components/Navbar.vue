<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-primary">VueBlog</a>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 仅保留首页链接 -->
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary transition-colors"
            :class="{ 'text-primary': $route.name === 'home' }"
          >
            首页
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 无需额外逻辑，仅保留基础结构
</script>
