const fs = require("fs");
const path = require("path");

function copyDirectory(src, dest, options = {}) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src);
  let count = 0;

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry);
    let destPath = path.join(dest, entry);

    // Skip markdown files for production build
    if (options.skipMarkdown && entry.endsWith(".md")) {
      return;
    }

    // Skip meta.json for docs
    if (options.skipMeta && entry === "meta.json") {
      return;
    }

    // Handle demo index.html renaming
    if (options.isDemo && entry === "index.html") {
      const demoHtmlPath = path.join(src, "demo.html");
      if (!fs.existsSync(demoHtmlPath)) {
        destPath = path.join(dest, "demo.html");
      }
    }

    if (fs.statSync(srcPath).isDirectory()) {
      count += copyDirectory(srcPath, destPath, options);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  });

  return count;
}

function copyContentDir(sourceDir, targetDir, options = {}) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`No ${path.basename(sourceDir)} directory found`);
    return 0;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const dirs = fs.readdirSync(sourceDir);
  let totalCopied = 0;

  dirs.forEach((dirId) => {
    const srcDir = path.join(sourceDir, dirId);
    const destDir = path.join(targetDir, dirId);

    if (fs.statSync(srcDir).isDirectory()) {
      totalCopied += copyDirectory(srcDir, destDir, options);
    }
  });

  return totalCopied;
}

function copyAssets(isDev = false) {
  const baseTargetDir = isDev
    ? path.join(__dirname, "..", "public")
    : path.join(__dirname, "..", "output");

  console.log(`Copying assets for ${isDev ? "development" : "production"}...`);

  // Copy posts
  const postsCopied = copyContentDir(
    path.join(__dirname, "..", "content", "posts"),
    path.join(baseTargetDir, "posts"),
    { skipMarkdown: true },
  );
  console.log(`Posts copied: ${postsCopied} files`);

  // Copy demos
  const demosCopied = copyContentDir(
    path.join(__dirname, "..", "content", "demos"),
    path.join(baseTargetDir, "demos"),
    { isDemo: true },
  );
  console.log(`Demos copied: ${demosCopied} files`);

  // Copy docs
  const docsCopied = copyContentDir(
    path.join(__dirname, "..", "content", "docs"),
    path.join(baseTargetDir, "docs"),
    { skipMarkdown: true, skipMeta: true },
  );
  console.log(`Docs copied: ${docsCopied} files`);

  // Copy moments
  const momentsCopied = copyContentDir(
    path.join(__dirname, "..", "content", "moments"),
    path.join(baseTargetDir, "moments"),
    { skipMarkdown: true },
  );
  console.log(`Moments copied: ${momentsCopied} files`);

  // Copy spec
  let specTotal = 0;
  const specSubDirs = ["about", "information", "journey", "projects"];
  for (const subDir of specSubDirs) {
    const src = path.join(__dirname, "..", "content", "spec", subDir);
    const dest = path.join(baseTargetDir, subDir);
    const copied = copyDirectory(src, dest, { skipMarkdown: true });
    specTotal += copied;
    console.log(
      `+ ${subDir.charAt(0).toUpperCase() + subDir.slice(1)} copied: ${copied} files`,
    );
  }
  console.log(`Spec total copied: ${specTotal} files`);

  const total =
    postsCopied + demosCopied + docsCopied + momentsCopied + specTotal;
  console.log(`Total assets copied: ${total} files\n`);
}

// Check if running as dev or production
const isDev = process.argv.includes("--dev");
copyAssets(isDev);
