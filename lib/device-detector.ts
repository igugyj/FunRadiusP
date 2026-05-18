/**
 * 设备检测工具函数
 */

// 检测操作系统
export const detectOS = (): string => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("like Mac")) return "iOS";
  if (userAgent.includes("X11")) return "UNIX";

  return platform || "Unknown OS";
};

// 检测浏览器
export const detectBrowser = (): string => {
  const userAgent = window.navigator.userAgent;

  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Opera") || userAgent.includes("OPR"))
    return "Opera";

  return "Unknown Browser";
};

// 检测是否是移动端
export const detectIsMobile = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "android",
    "webos",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
    "mobile",
    "opera mini",
    "iemobile",
    "silk",
    "kindle",
    "playbook",
    "bb10",
  ];
  const isMobileDevice = mobileKeywords.some((keyword) =>
    userAgent.includes(keyword),
  );
  // 检查是否是触摸设备
  const isTouchDevice =
    "ontouchstart" in window ||
    (navigator as any).maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;
  // 检查屏幕宽度
  const isSmallScreen = window.innerWidth < 768;
  // 只要满足其中一个条件就认为是移动端
  return isMobileDevice || isTouchDevice || isSmallScreen;
};
