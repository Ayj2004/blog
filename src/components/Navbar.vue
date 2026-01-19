<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container py-4">
      <nav class="flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-primary"
          >VueBlog</router-link
        >
        <div class="space-x-6">
          <router-link to="/" class="hover:text-primary transition-colors"
            >首页</router-link
          >
          <a href="#" class="hover:text-primary transition-colors">关于</a>
          <a href="#" class="hover:text-primary transition-colors">留言</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts"></script>
