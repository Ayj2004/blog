import { ref, computed } from "vue";
import type { Post, KVResponse } from "@/types";

// 边缘函数基础地址（抽离为常量，便于环境区分）
const EDGE_FUNCTION_BASE_URL = "https://kv-test.4fa2a2a9.er.aliyun-esa.net";

export const usePosts = () => {
  // 文章列表（响应式）
  const posts = ref<Post[]>([]);
  // 加载状态（细化：不同操作可复用，避免全局loading冲突）
  const loading = ref(false);
  // 错误信息（响应式）
  const error = ref("");

  /**
   * 重置错误信息（内部工具方法）
   */
  const resetError = () => {
    error.value = "";
  };

  // 1. 获取所有文章列表
  const fetchPosts = async (): Promise<KVResponse<Post[]>> => {
    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/posts`);

      // 校验响应状态码（非2xx直接抛错）
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

  // 2. 获取单篇文章详情（独立loading逻辑，避免影响列表loading）
  const fetchPostById = async (id: string): Promise<KVResponse<Post>> => {
    // 入参校验
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
        const post = result.data || null;
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

  // 3. 新增/更新文章（区分新增和更新的语义，保留统一入口）
  const savePost = async (post: Post): Promise<KVResponse> => {
    // 入参校验（核心字段非空检查）
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
        // 重新拉取列表，保证数据最新
        await fetchPosts();
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

  // 4. 删除文章
  const deletePost = async (id: string): Promise<KVResponse> => {
    // 入参校验
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
        await fetchPosts();
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

  // 文章总数
  const postCount = computed(() => posts.value.length);

  // 重置所有状态（可选，用于页面重置）
  const resetState = () => {
    posts.value = [];
    loading.value = false;
    error.value = "";
  };

  return {
    // 状态
    posts,
    loading,
    error,
    postCount,
    // 方法
    fetchPosts,
    fetchPostById,
    savePost,
    deletePost,
    resetState, // 新增：状态重置
  };
};
