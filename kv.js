async function handleRequest(request) {
  try {
    // 统一提取响应头常量
    const DEFAULT_HEADERS = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    // URL 解析容错
    let url, pathname, method;
    try {
      url = new URL(request.url);
      pathname = url.pathname;
      method = request.method.toUpperCase();
    } catch (urlErr) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "请求 URL 格式非法，无法解析",
        }),
        {
          status: 400,
          headers: DEFAULT_HEADERS,
        }
      );
    }

    // 处理 OPTIONS 预检请求
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 初始化 EdgeKV（验证模块是否可用）
    if (typeof EdgeKV === "undefined") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "EdgeKV 模块未加载，无法操作真实 KV 存储",
        }),
        {
          status: 500,
          headers: DEFAULT_HEADERS,
        }
      );
    }
    const edgeKV = new EdgeKV({ namespace: "test-msy" });
    const getType = { type: "json" };

    // 1. 获取所有文章列表（真实 KV 读取）
    if (method === "GET" && pathname === "/api/posts") {
      // 读取 post_list（直接传递字符串字面量，避免参数报错）
      const postList = (await edgeKV.get("post_list", getType)) || [];

      // 验证 postList 为数组
      if (!Array.isArray(postList)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "post_list 格式错误，预期为数组",
          }),
          {
            status: 500,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      // 批量读取单篇文章数据
      const posts = await Promise.all(
        postList.map(async (id) => {
          if (!id) return null;
          const idStr = String(id);
          const postKey = `post_${idStr}`;
          const post = await edgeKV.get(postKey, getType);

          // 补充 author/category 字段返回
          return post
            ? {
                id: idStr,
                title: post.title || "无标题",
                summary: post.summary || "无摘要",
                cover: post.cover || "https://picsum.photos/1440/1080",
                createTime: post.createTime || "",
                author: post.author || "匿名作者",
                category: post.category || "未分类",
                updateTime: post.updateTime || post.createTime || "",
              }
            : null;
        })
      );

      const validPosts = posts.filter(Boolean);
      return new Response(
        JSON.stringify({
          success: true,
          data: validPosts,
        }),
        {
          headers: DEFAULT_HEADERS,
        }
      );
    }

    // 2. 获取单篇文章详情（真实 KV 读取）
    if (method === "GET" && pathname.startsWith("/api/post/")) {
      const postId = pathname.split("/").pop();
      if (!postId) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "文章ID不能为空",
          }),
          {
            status: 400,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      const postIdStr = String(postId);
      const postKey = `post_${postIdStr}`;
      const post = await edgeKV.get(postKey, getType);

      if (!post) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "文章不存在",
          }),
          {
            status: 404,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      // 补充字段兜底
      const postWithDefault = {
        ...post,
        author: post.author || "匿名作者",
        category: post.category || "未分类",
        summary: post.summary || post.content.slice(0, 100),
      };

      return new Response(
        JSON.stringify({
          success: true,
          data: postWithDefault,
        }),
        {
          headers: DEFAULT_HEADERS,
        }
      );
    }

    // 3. 新增/更新文章（真实 KV 写入）
    if (method === "POST" && pathname === "/api/post") {
      const postData = await request.json();
      if (!postData.id || !postData.title || !postData.content) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "文章ID、标题、内容不能为空",
          }),
          {
            status: 400,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      // 补全时间字段 + 作者/分类兜底
      const now = new Date().toISOString();
      const post = {
        ...postData,
        id: String(postData.id),
        updateTime: now,
        createTime: postData.createTime || now,
        author: postData.author || "匿名作者",
        category: postData.category || "未分类",
        summary: postData.summary || postData.content.slice(0, 100),
      };

      // 写入单篇文章数据
      const postKey = `post_${post.id}`;
      await edgeKV.put(postKey, JSON.stringify(post));

      // 更新文章列表
      const postList = (await edgeKV.get("post_list", getType)) || [];
      if (!Array.isArray(postList)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "post_list 格式错误，预期为数组",
          }),
          {
            status: 500,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      if (!postList.includes(post.id)) {
        postList.push(post.id);
        await edgeKV.put("post_list", JSON.stringify(postList));
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: "文章保存成功（真实 KV 存储）",
        }),
        {
          headers: DEFAULT_HEADERS,
        }
      );
    }

    // 4. 删除文章（真实 KV 删除）
    if (method === "DELETE" && pathname.startsWith("/api/post/")) {
      const postId = pathname.split("/").pop();
      if (!postId) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "文章ID不能为空",
          }),
          {
            status: 400,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      const postIdStr = String(postId);
      const postKey = `post_${postIdStr}`;

      // 删除单篇文章数据
      const deleteResult = await edgeKV.delete(postKey);
      if (!deleteResult) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "文章删除失败",
          }),
          {
            status: 500,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      // 更新文章列表
      const postList = (await edgeKV.get("post_list", getType)) || [];
      if (!Array.isArray(postList)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "post_list 格式错误，预期为数组",
          }),
          {
            status: 500,
            headers: DEFAULT_HEADERS,
          }
        );
      }

      const newPostList = postList.filter((id) => String(id) !== postIdStr);
      await edgeKV.put("post_list", JSON.stringify(newPostList));

      return new Response(
        JSON.stringify({
          success: true,
          data: "文章删除成功（真实 KV 存储）",
        }),
        {
          headers: DEFAULT_HEADERS,
        }
      );
    }

    // 路由未匹配
    return new Response(
      JSON.stringify({
        success: false,
        error: "接口不存在",
      }),
      {
        status: 404,
        headers: DEFAULT_HEADERS,
      }
    );
  } catch (e) {
    // 异常处理
    const errorMsg = e.message || "未知操作异常";
    return new Response(
      JSON.stringify({
        success: false,
        error: `操作异常：${errorMsg}`,
      }),
      {
        status: 500,
        headers: DEFAULT_HEADERS,
      }
    );
  }
}

// 导出fetch处理函数
export default {
  async fetch(request) {
    return handleRequest(request);
  },
};
