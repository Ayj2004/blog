/** 博客文章类型 */
export interface Post {
  id: string;
  title: string;
  cover: string; // 封面图地址
  content: string; // 文章内容
  summary: string; // 文章摘要
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

/** KV操作返回结果类型 */
export interface KVResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
