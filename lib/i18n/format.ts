// 纯函数，无 JSON 依赖：供客户端 context 使用，避免拖入全量翻译
export function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === "object") {
      value = value[key];
    } else {
      return path;
    }
  }
  return typeof value === "string" ? value : path;
}

export function formatString(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params || Object.keys(params).length === 0) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() || `{${key}}`;
  });
}
