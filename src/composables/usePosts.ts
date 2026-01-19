import { ref, computed } from "vue";
import type { Post, KVResponse } from "@/types";

// 边缘函数基础地址（替换为实际部署的边缘函数域名/IP）
const EDGE_FUNCTION_BASE_URL = "https://kv-test.4fa2a2a9.er.aliyun-esa.net";

export const usePosts = () => {
  // 文章列表（响应式）
  const posts = ref<Post[]>([]);
  // 加载状态
  const loading = ref(false);
  // 错误信息
  const error = ref("");

  // 1. 获取所有文章列表
  const fetchPosts = async () => {
    loading.value = true;
    error.value = "";
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/posts`);
      const result: KVResponse<Post[]> = await response.json();
      if (result.success) {
        posts.value = result.data || [];
      } else {
        error.value = result.error || "获取文章列表失败";
      }
    } catch (e) {
      error.value = `网络异常：${(e as Error).message}`;
    } finally {
      loading.value = false;
    }
  };

  // 2. 获取单篇文章详情
  const fetchPostById = async (id: string): Promise<Post | null> => {
    loading.value = true;
    error.value = "";
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/post/${id}`);
      const result: KVResponse<Post> = await response.json();
      if (result.success) {
        return result.data || null;
      } else {
        error.value = result.error || "获取文章详情失败";
        return null;
      }
    } catch (e) {
      error.value = `网络异常：${(e as Error).message}`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 3. 新增/更新文章
  const savePost = async (post: Post): Promise<boolean> => {
    loading.value = true;
    error.value = "";
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      const result: KVResponse = await response.json();
      if (result.success) {
        // 重新拉取文章列表
        await fetchPosts();
        return true;
      } else {
        error.value = result.error || "保存文章失败";
        return false;
      }
    } catch (e) {
      error.value = `网络异常：${(e as Error).message}`;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 4. 删除文章
  const deletePost = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = "";
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/post/${id}`, {
        method: "DELETE",
      });
      const result: KVResponse = await response.json();
      if (result.success) {
        // 重新拉取文章列表
        await fetchPosts();
        return true;
      } else {
        error.value = result.error || "删除文章失败";
        return false;
      }
    } catch (e) {
      error.value = `网络异常：${(e as Error).message}`;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 文章总数
  const postCount = computed(() => posts.value.length);

  return {
    posts,
    loading,
    error,
    postCount,
    fetchPosts,
    fetchPostById,
    savePost,
    deletePost,
  };
};
