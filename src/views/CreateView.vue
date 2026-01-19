<template>
  <Layout title="创建文章 | VueBlog">
    <div class="max-w-3xl mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">创建新文章</h2>
      <!-- 文章表单：可结合表单组件（如VeeValidate）实现 -->
      <form @submit.prevent="handleSubmit">
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
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">封面图地址</label>
          <input
            v-model="postForm.cover"
            type="url"
            class="w-full px-3 py-2 border rounded"
            placeholder="请输入封面图URL"
            required
          />
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
        <button type="submit" class="btn btn-primary">保存文章</button>
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
const { savePost } = usePosts();

// 表单数据
const postForm = ref<Partial<Post>>({
  id: Date.now().toString(), // 临时用时间戳生成ID
  title: "",
  cover: "",
  content: "",
  summary: "",
  createTime: new Date().toLocaleString(),
  updateTime: new Date().toLocaleString(),
});

// 提交表单
const handleSubmit = async () => {
  if (
    !postForm.value.title ||
    !postForm.value.cover ||
    !postForm.value.content
  ) {
    alert("标题、封面、内容为必填项！");
    return;
  }
  // 补充摘要（可选：取内容前100字）
  postForm.value.summary = postForm.value.content.slice(0, 100);

  // 调用保存接口
  const result = await savePost(postForm.value as Post);
  if (result.success) {
    alert("文章创建成功！");
    router.push("/"); // 返回首页
  } else {
    alert(`创建失败：${result.error}`);
  }
};
</script>
