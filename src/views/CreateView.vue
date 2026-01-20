<template>
  <Layout title="创建文章 | VueBlog">
    <div class="max-w-3xl mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">创建新文章</h2>
      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-2 font-medium"
            >标题 <span class="text-red-500">*</span></label
          >
          <input
            v-model="postForm.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="请输入文章标题"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 mb-2 font-medium"
            >封面图地址 <span class="text-red-500">*</span></label
          >
          <input
            v-model="postForm.cover"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="请输入封面图URL（如：https://picsum.photos/1440/1080）"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 mb-2 font-medium"
            >内容 <span class="text-red-500">*</span></label
          >
          <textarea
            v-model="postForm.content"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 h-60"
            placeholder="请输入文章内容"
            required
          ></textarea>
        </div>
        <div>
          <label class="block text-gray-700 mb-2 font-medium"
            >分类（可选）</label
          >
          <input
            v-model="postForm.category"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="请输入文章分类"
          />
        </div>
        <button
          type="submit"
          class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          :disabled="loading"
        >
          <span v-if="loading" class="inline-block animate-spin mr-2">🔄</span>
          保存文章
        </button>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { Post } from "@/types";
import Layout from "@/components/Layout.vue";
import { usePosts } from "@/composables/usePosts";

const router = useRouter();
const { loading, savePost } = usePosts();

// 表单数据
const postForm = ref<Partial<Post>>({
  id: Date.now().toString(), // 时间戳生成唯一ID
  title: "",
  cover: "",
  content: "",
  summary: "",
  createTime: new Date().toLocaleString(),
  updateTime: new Date().toLocaleString(),
  category: "",
  author: "匿名作者",
});

// 提交表单
const handleSubmit = async () => {
  // 基础校验
  if (
    !postForm.value.title ||
    !postForm.value.cover ||
    !postForm.value.content
  ) {
    alert("标题、封面、内容为必填项！");
    return;
  }

  // 生成摘要（内容前100字）
  postForm.value.summary = postForm.value.content.slice(0, 100);

  // 调用保存接口
  const result = await savePost(postForm.value as Post);
  if (result.success) {
    alert("文章创建成功！");
    router.push("/"); // 返回首页
  } else {
    alert(`创建失败：${result.error || "未知错误"}`);
  }
};
</script>
