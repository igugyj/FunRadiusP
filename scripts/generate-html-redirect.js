// scripts/generate-html-redirect.js
const fs = require("fs");
const path = require("path");

/**
 * 生成一个重定向 HTML 页面
 * @param {string} shortCode - 短码，将创建 /p/{shortCode}/index.html
 * @param {string} targetUrl - 重定向目标 URL（绝对或相对）
 * @param {string} outputDir - 输出根目录，默认为 './public/p'
 */
function createRedirectPage(shortCode, targetUrl, outputDir = "./public/p") {
  const dir = path.join(outputDir, shortCode);
  const file = path.join(dir, "index.html");
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a></p>
</body>
</html>`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, html, "utf8");
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
