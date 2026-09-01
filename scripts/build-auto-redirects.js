// scripts/build-auto-redirects.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createRedirectPage } = require("./generate-html-redirect");

// 加载配置
const configPath = path.join(__dirname, "..", "redirect-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const postsRoot = path.join(__dirname, "..", config.postsDir);
const excludeSet = new Set(config.excludeDirs);
const articleFile = config.articleFile;
const codeLen = config.shortCodeLength;

/**
 * 将 Buffer 转为 Base62 字符串
 */
function toBase62(buffer) {
  let num = BigInt("0x" + buffer.toString("hex"));
  let result = "";
  while (num > 0) {
    result = BASE62[Number(num % 62n)] + result;
    num /= 62n;
  }
  while (result.length < codeLen) {
    result = "0" + result;
  }
  return result.slice(0, codeLen);
}

/**
 * 扫描目录，生成映射
 */
function buildAutoRedirects() {
  const autoMap = {};
  const items = fs.readdirSync(postsRoot, { withFileTypes: true });
  const dirs = items
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith("."))
    .filter((name) => !excludeSet.has(name));

  for (const dirName of dirs) {
    const articlePath = path.join(postsRoot, dirName, articleFile);
    if (!fs.existsSync(articlePath)) {
      continue; // 没有文章文件则跳过
    }
    // 使用完整相对路径（相对于项目根）来生成哈希，保证唯一性
    const relativePath = path.join(config.postsDir, dirName);
    const hash = crypto.createHash("sha256").update(relativePath).digest();
    const shortCode = toBase62(hash);
    if (autoMap[shortCode]) {
      throw new Error(
        `Auto redirect collision: shortCode "${shortCode}" generated for both "${autoMap[shortCode]}" and "${dirName}". Please rename one folder.`,
      );
    }
    // 构建正确的目标 URL，使用配置中的 articleUrlPrefix
    const targetUrl = config.articleUrlPrefix + "/" + dirName;
    autoMap[shortCode] = targetUrl;
    // 生成 HTML 重定向页面
    createRedirectPage(shortCode, targetUrl);
    console.log(`Auto: /p/${shortCode} -> ${targetUrl}`);
  }

  // 保存映射表
  const mapFile = path.join(
    __dirname,
    "..",
    ".redirects",
    "auto-redirect-map.json",
  );
  fs.mkdirSync(path.dirname(mapFile), { recursive: true });
  fs.writeFileSync(mapFile, JSON.stringify(autoMap, null, 2), "utf8");
  console.log(`Auto redirect map saved to ${mapFile}`);
  return autoMap;
}

// 直接运行
if (require.main === module) {
  buildAutoRedirects();
}

module.exports = { buildAutoRedirects };
