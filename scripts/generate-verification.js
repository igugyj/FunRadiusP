const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const outputDir = path.join(process.cwd(), "output");

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com").replace(/\/+$/, "");
const indexNowKey = process.env.INDEXNOW_KEY;
const bingVerification = process.env.NEXT_PUBLIC_BING_VERIFICATION;

// robots.txt
if (siteUrl) {
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  fs.writeFileSync(path.join(outputDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`);
  console.log(`Generated robots.txt → sitemap: ${sitemapUrl}`);
}

// IndexNow key file
if (indexNowKey) {
  fs.writeFileSync(path.join(outputDir, `${indexNowKey}.txt`), indexNowKey);
  console.log(`Generated ${indexNowKey}.txt`);
}

// BingSiteAuth.xml
if (bingVerification) {
  fs.writeFileSync(path.join(outputDir, "BingSiteAuth.xml"), `<?xml version="1.0"?>\n<users>\n\t<user>${bingVerification}</user>\n</users>\n`);
  console.log("Generated BingSiteAuth.xml");
}
