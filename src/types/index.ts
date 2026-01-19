/** 博客文章核心类型 */
export interface Post {
  id: string; // 固定为string类型（避免多类型兼容问题，统一ID格式）
  title: string; // 文章标题
  cover: string; // 封面图地址（空字符串表示无封面）
  content: string; // 文章内容（支持富文本/Markdown）
  summary: string; // 文章摘要
  createTime: string; // 创建时间（ISO格式：YYYY-MM-DD HH:mm:ss 或 时间戳字符串）
  updateTime: string; // 更新时间（同createTime格式）
}

/**
 * KV操作返回结果通用类型
 * @template T - 返回数据的类型（默认any，推荐显式指定）
 */
export interface KVResponse<T = any> {
  success: boolean; // 操作是否成功
  data?: T; // 成功时返回的数据（可选，无数据时不返回）
  error?: string; // 失败时的错误信息（可选，成功时不返回）
  [key: string]: any; // 扩展字段（适配不同KV存储的额外返回值，如耗时、版本号等）
}

// ---------------- 扩展KV存储相关类型（可选，增强类型安全） ----------------
/**
 * KV存储键名枚举（统一管理所有KV键，避免硬编码）
 */
export enum KVKeys {
  POST_LIST = "blog_post_list", // 文章列表缓存键
  POST_DRAFT = "blog_post_draft", // 文章草稿键
  POST_LAST_EDIT = "blog_post_last_edit_id", // 最后编辑的文章ID键
}

/**
 * KV存储操作类型（区分CRUD）
 */
export type KVOperation = "get" | "set" | "remove" | "clear";
