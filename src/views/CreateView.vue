<template>
  <Layout title="创建文章 | VueBlog">
    <div class="max-w-3xl mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">创建新文章</h2>
      <!-- 文章表单 -->
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

        <!-- 随机封面预览（无需手动输入） -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">封面图（随机生成）</label>
          <div class="flex items-center gap-4">
            <img
              :src="postForm.cover"
              alt="随机封面"
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
        <button
          type="submit"
          class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          保存文章
        </button>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { Post } from "@/types";
import Layout from "@/components/Layout.vue";
import { usePosts } from "@/composables/usePosts";

const router = useRouter();
const { savePost } = usePosts();

// 生成随机封面图的方法
const generateRandomCover = () => {
  // 使用picsum.photos生成随机图片（尺寸：800x400，随机id）
  const randomId = Math.floor(Math.random() * 1000);
  postForm.value.cover = `https://picsum.photos/800/400?random=${randomId}`;
};

// 表单数据
const postForm = ref<Partial<Post>>({
  id: Date.now().toString(), // 临时用时间戳生成ID
  title: "",
  author: "", // 作者（手动填写）
  category: "", // 分类（手动填写）
  cover: "", // 初始为空，挂载后自动生成
  content: "",
  summary: "",
  createTime: new Date().toLocaleString(),
  updateTime: new Date().toLocaleString(),
});

// 页面挂载时自动生成随机封面
onMounted(() => {
  generateRandomCover();
});

// 提交表单
const handleSubmit = async () => {
  // 校验必填项：标题、作者、分类、内容
  if (
    !postForm.value.title ||
    !postForm.value.author ||
    !postForm.value.category ||
    !postForm.value.content
  ) {
    alert("标题、作者、分类、内容为必填项！");
    return;
  }
  // 补充摘要（取内容前100字）
  postForm.value.summary = postForm.value.content.slice(0, 100);
  // 兜底：防止字段未定义导致展示异常
  postForm.value.author = postForm.value.author || "匿名作者";
  postForm.value.category = postForm.value.category || "未分类";

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
