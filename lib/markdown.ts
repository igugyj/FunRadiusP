import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fs from "fs";
import path from "path";
import { visit } from "unist-util-visit";

// Callout 配置
const calloutConfigs = {
  NOTE: {
    title: "NOTE",
    color: "blue",
    iconType: "note",
  },
  TIP: {
    title: "TIP",
    color: "green",
    iconType: "tip",
  },
  IMPORTANT: {
    title: "IMPORTANT",
    color: "blue",
    iconType: "important",
  },
  WARNING: {
    title: "WARNING",
    color: "yellow",
    iconType: "warning",
  },
  CAUTION: {
    title: "CAUTION",
    color: "red",
    iconType: "caution",
  },
  QUOTE: {
    title: "QUOTE",
    color: "blue",
    iconType: "quote",
  },
  SUCCESS: {
    title: "SUCCESS",
    color: "green",
    iconType: "success",
  },
  FAILURE: {
    title: "FAILURE",
    color: "red",
    iconType: "failure",
  },
  REFERENCES: {
    title: "REFERENCES",
    color: "blue",
    iconType: "references",
  },
};

// 创建 SVG 图标 HTML
function createCalloutIconHtml(iconType: string) {
  let iconContent = "";

  switch (iconType) {
    case "note":
      iconContent =
        '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
      break;
    case "tip":
      iconContent =
        '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>';
      break;
    case "important":
      iconContent =
        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
      break;
    case "warning":
      iconContent =
        '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>';
      break;
    case "caution":
      iconContent =
        '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>';
      break;
    case "quote":
      iconContent =
        '<path d="M3 21c3 0 7-1 7-8V5c-1.25 0-2.75-.5-3.5-2C6.5 5 5 5 5 5v8c0 5-2 8-2 8z"></path><path d="M12 21c3 0 7-1 7-8V5c-1.25 0-2.75-.5-3.5-2c-.5 2-2 2-2 2v8c0 5-2 8-2 8z"></path>';
      break;
    case "success":
      iconContent = '<polyline points="20 6 9 17 4 12"></polyline>';
      break;
    case "failure":
      iconContent =
        '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
      break;
    case "references":
      iconContent =
        '<path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H19C19.5523 20 20 19.5523 20 19V12"></path><path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" fill="currentColor"></path>';
      break;
  }

  return `<svg class="callout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconContent}</svg>`;
}

// Remark 插件：处理 GitHub callout
function remarkGithubCallout() {
  return (tree: any) => {
    visit(
      tree,
      "blockquote",
      (node: any, index: number | undefined, parent: any) => {
        if (
          node.children &&
          node.children.length > 0 &&
          node.children[0].type === "paragraph"
        ) {
          const firstPara = node.children[0];
          let calloutType: string | null = null;

          if (firstPara.children && firstPara.children.length > 0) {
            for (let i = 0; i < firstPara.children.length; i++) {
              const child = firstPara.children[i];
              if (child.type === "text" && child.value) {
                const match = child.value.match(
                  /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|QUOTE|SUCCESS|FAILURE|REFERENCES)\]/,
                );
                if (match) {
                  calloutType = match[1];
                  const contentStartIndex = match[0].length;
                  child.value = child.value.slice(contentStartIndex).trim();
                  if (!child.value) {
                    firstPara.children.splice(i, 1);
                  }
                  break;
                }
              }
            }
          }

          if (calloutType && index !== undefined) {
            const config =
              calloutConfigs[calloutType as keyof typeof calloutConfigs];
            if (config && parent) {
              const iconHtml = createCalloutIconHtml(config.iconType);

              const calloutNode = {
                type: "html",
                value: `<div class="callout callout-${config.color.toLowerCase()}"><div class="callout-header">${iconHtml}<span class="callout-title">${config.title}</span></div><div class="callout-content">`,
              };

              const endCalloutNode = {
                type: "html",
                value: "</div></div>",
              };

              const newChildren = [
                calloutNode,
                ...node.children,
                endCalloutNode,
              ];
              parent.children.splice(index, 1, ...newChildren);
            }
          }
        }
      },
    );
  };
}

// 处理时间线语法
function processTimelineSyntax(markdown: string): string {
  const timelineRegex =
    /::: timeline[\s\S]*?title: (.*?)[\s\S]*?date: (.*?)[\s\S]*?icon: (.*?)[\s\S]*?---[\s\S]*?:::/g;

  return markdown.replace(timelineRegex, (match, title, date, icon) => {
    const contentMatch = match.match(/---[\s\S]*?:::/);
    const content = contentMatch
      ? contentMatch[0].replace(/---|:::/g, "").trim()
      : "";

    return `
<div class="timeline-item">
  <div class="timeline-icon">${icon || ""}</div>
  <div class="timeline-content">
    <h3 class="timeline-title">${title || ""}</h3>
    <p class="timeline-date">${date || ""}</p>
    <div class="timeline-body">${content}</div>
  </div>
</div>
`;
  });
}

// Markdown 转 HTML
export async function markdownToHtml(
  markdown: string,
  context?: {
    type: "post" | "doc" | "moment";
    id: string;
    collection?: string;
  },
  addHeadingIds: boolean = true,
): Promise<string> {
  // 处理时间线语法
  let processedMarkdown = processTimelineSyntax(markdown);

  // 处理本地相对路径图片 - 在 Markdown 阶段替换
  if (context) {
    if (context.type === "post") {
      processedMarkdown = processedMarkdown.replace(
        /!\[([^\]]*)\]\((?!http|https|\/)([^)]+)\)/g,
        (match, alt, src) => {
          return `![${alt}](/posts/${context.id}/${src})`;
        },
      );
    } else if (context.type === "doc" && context.collection) {
      processedMarkdown = processedMarkdown.replace(
        /!\[([^\]]*)\]\((?!http|https|\/)([^)]+)\)/g,
        (match, alt, src) => {
          return `![${alt}](/docs/${context.collection}/${src})`;
        },
      );
    } else if (context.type === "moment") {
      processedMarkdown = processedMarkdown.replace(
        /!\[([^\]]*)\]\((?!http|https|\/)([^)]+)\)/g,
        (match, alt, src) => {
          return `![${alt}](/moments/${context.id}/${src})`;
        },
      );
    }
  }

  // 根据参数决定是否添加标题id
  const processor = addHeadingIds
    ? unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkGithubCallout)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight)
        .use(rehypeSlug)
        .use(rehypeKatex)
        .use(rehypeStringify, { allowDangerousHtml: true })
    : unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkGithubCallout)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight)
        .use(rehypeKatex)
        .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(processedMarkdown);

  return result.toString();
}

// 读取特殊页面的 Markdown 文件
export async function getSpecPageContent(page: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'content', 'spec', page, 'index.md');
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return '';
  } catch (error) {
    console.error(`Error reading spec page ${page}:`, error);
    return '';
  }
}
