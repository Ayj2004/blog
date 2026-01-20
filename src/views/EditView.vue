<template>
  <Layout title="编辑文章 | VueBlog">
    <div class="max-w-3xl mx-auto p-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-10">
        <span class="inline-block animate-spin mr-2">🔄</span>
        加载文章中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>

      <!-- 文章表单（仅加载完成后显示） -->
      <form v-if="post" @submit.prevent="handleSubmit" class="mb-6">
        <h2 class="text-2xl font-bold mb-6">编辑文章</h2>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">标题</label>
          <input
            v-model="postForm.title"
            type="text"
            class="w-full px-3 py-2 border rounded"
            placeholder="请输入文章标题"
            required
          />
        </div>

        <!-- 作者输入框 -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">作者</label>
          <input
            v-model="postForm.author"
            type="text"
            class="w-full px-3 py-2 border rounded"
            placeholder="请输入作者名称"
            required
          />
        </div>

        <!-- 分类输入框 -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">分类</label>
          <input
            v-model="postForm.category"
            type="text"
            class="w-full px-3 py-2 border rounded"
            placeholder="请输入文章分类（如：技术、生活、随笔）"
            required
          />
        </div>

        <!-- 封面预览 -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">封面图</label>
          <div class="flex items-center gap-4">
            <img
              :src="postForm.cover"
              alt="文章封面"
              class="w-32 h-20 object-cover rounded border"
            />
            <button
              type="button"
              class="px-3 py-1 border rounded text-sm hover:bg-gray-100"
              @click="generateRandomCover"
            >
              换一张
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">内容</label>
          <textarea
            v-model="postForm.content"
            class="w-full px-3 py-2 border rounded h-40"
            placeholder="请输入文章内容"
            required
          ></textarea>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            保存修改
          </button>
          <router-link
            to="/"
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            取消
          </router-link>
        </div>
      </form>

      <!-- 文章不存在 -->
      <div v-if="!loading && !error && !post" class="text-center py-10">
        <p class="text-gray-500">该文章不存在或已被删除</p>
        <router-link
          to="/"
          class="text-primary mt-4 inline-block hover:underline"
        >
          返回首页
        </router-link>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { Post } from "@/types";
import Layout from "@/components/Layout.vue";
import { usePosts } from "@/composables/usePosts";

const router = useRouter();
const route = useRoute();
const postId = route.params.id as string;

const { loading, error, fetchPostById, updatePost } = usePosts();
const post = ref<Post | null>(null);
const postForm = ref<Partial<Post>>({});

// 生成随机封面
const generateRandomCover = () => {
  const randomId = Math.floor(Math.random() * 1000);
  postForm.value.cover = `https://picsum.photos/800/400?random=${randomId}`;
};

// 加载文章数据
onMounted(async () => {
  if (postId) {
    const result = await fetchPostById(postId);
    if (result.success && result.data) {
      post.value = result.data;
      // 初始化表单数据
      postForm.value = { ...result.data };
    } else {
      post.value = null;
    }
  }
});

// 提交修改
const handleSubmit = async () => {
  if (
    !postForm.value.title ||
    !postForm.value.author ||
    !postForm.value.category ||
    !postForm.value.content
  ) {
    alert("标题、作者、分类、内容为必填项！");
    return;
  }

  // 补充必要字段
  postForm.value.id = postId;
  postForm.value.summary = postForm.value.content.slice(0, 100);
  postForm.value.updateTime = new Date().toLocaleString();

  const result = await updatePost(postForm.value as Post);
  if (result.success) {
    alert("文章修改成功！");
    router.push({ name: "detail", params: { id: postId } });
  } else {
    alert(`修改失败：${result.error}`);
  }
};
</script>
