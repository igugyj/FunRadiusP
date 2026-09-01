// scripts/build-all-redirects.js
const { buildAutoRedirects } = require("./build-auto-redirects");
const { buildCustomRedirects } = require("./build-custom-redirects");
const fs = require("fs");
const path = require("path");

function buildAll() {
  // 先清理 public/p 目录（避免旧文件残留）
  const pDir = path.join(__dirname, "..", "public", "p");
  if (fs.existsSync(pDir)) {
    fs.rmSync(pDir, { recursive: true, force: true });
  }

  const autoMap = buildAutoRedirects();
  const customMap = buildCustomRedirects();

  // 检测冲突：自定义覆盖自动？
  const conflicts = [];
  for (const [code, target] of Object.entries(customMap)) {
    if (autoMap[code]) {
      conflicts.push(
        `ShortCode "${code}" conflicts: auto -> ${autoMap[code]}, custom -> ${target}`,
      );
    }
  }
  if (conflicts.length > 0) {
    throw new Error("Redirect collision detected:\n" + conflicts.join("\n"));
  }

  // 合并映射表
  const merged = { ...autoMap, ...customMap };
  const mergedFile = path.join(
    __dirname,
    "..",
    ".redirects",
    "redirect-map.json",
  );
  fs.writeFileSync(mergedFile, JSON.stringify(merged, null, 2), "utf8");
  console.log(`Total redirects: ${Object.keys(merged).length}`);
}

if (require.main === module) {
  buildAll();
}

module.exports = { buildAll };
