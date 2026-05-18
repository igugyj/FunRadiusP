// 生成 URL 友好的 slug
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 分页函数
export function paginate<T>(items: T[], page: number, pageSize: number): {
  items: T[];
  totalPages: number;
  currentPage: number;
} {
  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalPages,
    currentPage: page,
  };
}

// 计算标签大小（根据文章数量）
export function getTagSize(count: number): string {
  if (count >= 10) return 'text-2xl';
  if (count >= 5) return 'text-xl';
  if (count >= 3) return 'text-lg';
  return 'text-base';
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 格式化随笔时间（显示到分钟）
export function formatMomentTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 获取上一篇和下一篇文章
export function getPrevNextPosts<T extends { id: string }>(posts: T[], currentId: string) {
  const currentIndex = posts.findIndex((post) => post.id === currentId);
  if (currentIndex === -1) return { prev: null, next: null };

  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return { prev, next };
}