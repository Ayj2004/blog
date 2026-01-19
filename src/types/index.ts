// 文章类型定义
export interface Post {
  id: number;
  title: string;
  excerpt: string; // 摘要
  content: string; // 正文
  cover: string; // 封面图
  category: string; // 分类
  createTime: string; // 创建时间
  author: string; // 作者
}
