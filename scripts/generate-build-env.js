const fs = require("fs");
const path = require("path");
const os = require("os");

const buildTime = new Date()
  .toISOString()
  .replace("T", " ")
  .replace(/\.\d+Z$/, " UTC");
const envLocalPath = path.join(__dirname, "..", ".env");

// Remove old build-time line if present
let content = "";
if (fs.existsSync(envLocalPath)) {
  content = fs.readFileSync(envLocalPath, "utf8");
  content = content
    .split(os.EOL)
    .filter((l) => !l.startsWith("NEXT_PUBLIC_BUILD_TIME="))
    .join(os.EOL);
}

content += `${content ? os.EOL : ""}NEXT_PUBLIC_BUILD_TIME=${buildTime}${os.EOL}`;
fs.writeFileSync(envLocalPath, content);
console.log(`Build time set: ${buildTime}`);
