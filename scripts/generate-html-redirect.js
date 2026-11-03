// scripts/generate-html-redirect.js
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const DELAY = 3; // 秒，中间页自动跳转延迟
const TEMPLATE_PATH = path.join(__dirname, "redirect-template.html");
// GIF 只放在 public/ 根目录一份，所有中间页通过绝对路径引用，不逐文件夹复制
const ASSET_URL = "/loading.gif";
// 站点域名（用于把站内相对路径拼成全链展示），去掉结尾斜杠
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"
).replace(/\/+$/, "");

// 模块加载时读取一次模板并缓存
if (!fs.existsSync(TEMPLATE_PATH)) {
  throw new Error(`Missing build input: ${TEMPLATE_PATH}`);
}
const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, "utf8");

/**
 * 用模板生成一个重定向中间页
 * @param {string} shortCode - 短码，将创建 {outputDir}/{shortCode}/index.html
 * @param {string} targetUrl - 重定向目标 URL（绝对或相对）
 * @param {string} outputDir - 输出根目录，默认为 './public/p'
 */
function createRedirectPage(shortCode, targetUrl, outputDir = "./public/p") {
  const dir = path.join(outputDir, shortCode);
  const file = path.join(dir, "index.html");
  // 全链：站内相对路径拼上域名；已是绝对 URL（如自定义外链）则原样使用
  const fullUrl = /^https?:\/\//i.test(targetUrl)
    ? targetUrl
    : `${SITE_URL}${targetUrl.startsWith("/") ? "" : "/"}${targetUrl}`;
  const page = TEMPLATE.replaceAll("{{delay}}", String(DELAY))
    .replaceAll("{{delay_ms}}", String(DELAY * 1000))
    .replaceAll("{{asset}}", ASSET_URL)
    .replaceAll("{{target_full}}", escapeHtml(fullUrl))
    .replaceAll("{{target_html}}", escapeHtml(targetUrl))
    .replaceAll("{{target_js}}", JSON.stringify(targetUrl));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, page, "utf8");
}

/**
 * HTML 转义（用于 meta refresh / title / <a> 等 HTML 上下文）
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// 如果直接运行该脚本（命令行调用），则根据参数执行
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(
      "Usage: node generate-html-redirect.js <shortCode> <targetUrl> [outputDir]",
    );
    process.exit(1);
  }
  const [shortCode, targetUrl, outputDir] = args;
  createRedirectPage(shortCode, targetUrl, outputDir || "./public/p");
  console.log(`Generated /p/${shortCode} -> ${targetUrl}`);
}

module.exports = { createRedirectPage };
