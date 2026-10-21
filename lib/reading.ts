// 构建期计算文章字数与阅读时间（服务端使用，不进浏览器 bundle）

// CJK 统一表意文字 + 扩展 A + 平假名/片假名 + 谚文
const CJK_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g;

/** 每分钟阅读单位数（中文约 400 字/分，英文约 200 词/分） */
export const WORDS_PER_MINUTE = 400;
/** 1 个英文/数字单词折算的阅读单位（约等于 2 个汉字的阅读量） */
export const LATIN_WORD_WEIGHT = 2;

export interface ReadingStats {
  words: number;
  minutes: number;
}

// 剥离不影响阅读的语法：代码、公式、标签与 markdown 标记
function stripMarkdown(markdown: string): string {
  return (
    markdown
      // 代码围栏（``` 或 ~~~）
      .replace(/^[\t ]*(```|~~~)[^\n]*\n[\s\S]*?^[\t ]*\1[\t ]*$/gm, " ")
      // HTML 标签与注释
      .replace(/<[^>]+>/g, " ")
      // 图片（含 alt 整体丢弃）
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      // 链接保留文字
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 行内代码
      .replace(/`[^`]*`/g, " ")
      // 行块公式
      .replace(/\$\$[\s\S]*?\$\$/g, " ")
      .replace(/\$[^$\n]+\$/g, " ")
      // 标题、引用、列表标记
      .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, " ")
      .replace(/^[ \t]{0,3}>[ \t]?/gm, " ")
      .replace(/^[\t ]*(?:[-*+]|\d+\.)[ \t]+/gm, " ")
      // 表格分隔符与强调符号
      .replace(/\|/g, " ")
      .replace(/[*_~`#]/g, " ")
  );
}

/**
 * 统计字数与阅读时间。
 * 中日韩字符按 1 字计，英文/数字按单词计（排除代码块与公式）。
 */
export function getReadingStats(content: string): ReadingStats {
  const text = stripMarkdown(content || "");

  const cjkMatches = text.match(CJK_PATTERN);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // 移除 CJK 后按空白切分，两端标点剔除，过滤纯符号片段
  const rest = text.replace(CJK_PATTERN, " ");
  const latinWords = rest
    .split(/\s+/)
    .map((token) => token.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter((token) => token.length > 0).length;

  const words = cjkCount + latinWords;
  const units = cjkCount + latinWords * LATIN_WORD_WEIGHT;
  const minutes = Math.max(1, Math.round(units / WORDS_PER_MINUTE));

  return { words, minutes };
}
