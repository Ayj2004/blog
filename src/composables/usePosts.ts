import { ref, computed } from "vue";
import type { Post, KVResponse } from "@/types";

// 边缘函数地址（替换为你的实际地址）
const EDGE_FUNCTION_BASE_URL = "https://kv-test.4fa2a2a9.er.aliyun-esa.net";

export const usePosts = () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref("");

  // 根据ID查找本地文章
  const getPostById = (id: string | number): Post | undefined => {
    return posts.value.find((post) => post.id === id);
  };

  // 重置错误信息
  const resetError = () => {
    error.value = "";
  };

  // 1. 获取所有文章列表
  const fetchPosts = async (): Promise<KVResponse<Post[]>> => {
    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/posts`);
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }
      const result: KVResponse<Post[]> = await response.json();
      if (result.success) {
        posts.value = result.data || [];
        return { success: true, data: posts.value };
      } else {
        const errMsg = result.error || "获取文章列表失败";
        error.value = errMsg;
        return { success: false, error: errMsg };
      }
    } catch (e) {
      const errMsg = `网络异常：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 2. 获取单篇文章详情
  const fetchPostById = async (id: string): Promise<KVResponse<Post>> => {
    if (!id || typeof id !== "string") {
      const errMsg = "文章ID格式错误（必须为非空字符串）";
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/post/${id}`);
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }
      const result: KVResponse<Post> = await response.json();
      if (result.success) {
        const post = result.data ?? undefined;
        return { success: true, data: post };
      } else {
        const errMsg = result.error || "获取文章详情失败";
        error.value = errMsg;
        return { success: false, error: errMsg };
      }
    } catch (e) {
      const errMsg = `网络异常：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 3. 新增/更新文章
  const savePost = async (post: Post): Promise<KVResponse> => {
    const requiredFields = [
      "id",
      "title",
      "content",
      "createTime",
      "updateTime",
    ] as const;
    const emptyFields = requiredFields.filter((field) => !post[field]);
    if (emptyFields.length > 0) {
      const errMsg = `文章必填字段为空：${emptyFields.join(", ")}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }
      const result: KVResponse = await response.json();
      if (result.success) {
        await fetchPosts(); // 重新拉取列表
        return { success: true };
      } else {
        const errMsg = result.error || "保存文章失败";
        error.value = errMsg;
        return { success: false, error: errMsg };
      }
    } catch (e) {
      const errMsg = `网络异常：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 4. 删除文章（可选扩展）
  const deletePost = async (id: string): Promise<KVResponse> => {
    if (!id || typeof id !== "string") {
      const errMsg = "文章ID格式错误（必须为非空字符串）";
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/post/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }
      const result: KVResponse = await response.json();
      if (result.success) {
        await fetchPosts(); // 重新拉取列表
        return { success: true };
      } else {
        const errMsg = result.error || "删除文章失败";
        error.value = errMsg;
        return { success: false, error: errMsg };
      }
    } catch (e) {
      const errMsg = `网络异常：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 文章数量
  const postCount = computed(() => posts.value.length);

  // 重置状态
  const resetState = () => {
    posts.value = [];
    loading.value = false;
    error.value = "";
  };

  return {
    posts,
    loading,
    error,
    postCount,
    fetchPosts,
    fetchPostById,
    getPostById,
    savePost,
    deletePost,
    resetState,
  };
};
