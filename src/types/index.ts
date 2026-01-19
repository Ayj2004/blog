/** 博客文章类型 */
export interface Post {
  id: string | number; // 兼容 string/number，解决 id 类型不匹配
  title: string;
  cover: string; // 封面图地址
  content: string; // 文章内容
  summary: string; // 文章摘要
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  // 补充组件中使用的缺失字段（可选字段用 ? 标记，避免无数据时报错）
  category?: string;
  excerpt?: string;
  author?: string;
}

/** KV操作返回结果类型 */
export interface KVResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
