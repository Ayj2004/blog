import { ref, computed } from "vue";
import type { Post, KVResponse } from "@/types";

const EDGE_FUNCTION_BASE_URL = "https://kv-test.4fa2a2a9.er.aliyun-esa.net";

export const usePosts = () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref("");

  // 新增：补充缺失的 getPostById 方法（解决 TS2339）
  const getPostById = (id: string | number): Post | undefined => {
    return posts.value.find((post) => post.id === id);
  };

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

  // 2. 获取单篇文章详情（修复：返回 Post | undefined，解决 null/undefined 不兼容）
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
        // 修复：将 null 转为 undefined，匹配 Post | undefined 类型
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

  const postCount = computed(() => posts.value.length);

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
    getPostById, // 导出新增的 getPostById 方法
    savePost,
    deletePost,
    resetState,
  };
};
