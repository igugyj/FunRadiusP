"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  dark: string;
  background: string;
  text: string;
  gradientStart: string;
  gradientEnd: string;
  headerBg: string;
  mobileMenuBg: string;
  cardBorder: string;
  codeCopyBorder: string;
  tableBorder: string;
}

const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 105, b: 180 };
};

const rgbToHex = (rgb: RGB): string => {
  return (
    "#" +
    [rgb.r, rgb.g, rgb.b].map((x) => x.toString(16).padStart(2, "0")).join("")
  );
};

const adjustLightness = (rgb: RGB, factor: number): RGB => {
  return {
    r: Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
    g: Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
    b: Math.min(255, Math.max(0, Math.round(rgb.b * factor))),
  };
};

const mixWithWhite = (rgb: RGB, whiteRatio: number): RGB => {
  return {
    r: Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio),
    g: Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio),
    b: Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio),
  };
};

const mixWithBlack = (rgb: RGB, blackRatio: number): RGB => {
  return {
    r: Math.round(rgb.r * (1 - blackRatio)),
    g: Math.round(rgb.g * (1 - blackRatio)),
    b: Math.round(rgb.b * (1 - blackRatio)),
  };
};

const rgbaToHex = (rgb: RGB, alpha: number): string => {
  const r = Math.round(rgb.r);
  const g = Math.round(rgb.g);
  const b = Math.round(rgb.b);
  const a = Math.round(alpha * 255);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const generateThemeColors = (primaryRgb: RGB, isDark: boolean): ThemeColors => {
  if (isDark) {
    const lightPrimary = adjustLightness(primaryRgb, 1.1);
    const darkPrimary = primaryRgb;
    const secondary = mixWithBlack(lightPrimary, 0.85);
    const background = { r: 26, g: 26, b: 26 };
    const text = { r: 224, g: 224, b: 224 };
    const gradientStart = mixWithBlack(lightPrimary, 0.8);
    const gradientEnd = { r: 38, g: 39, b: 43 };
    const headerBg = rgbaToHex(background, 0.85);
    const mobileMenuBg = rgbaToHex(background, 0.95);
    const cardBorder = rgbaToHex(lightPrimary, 0.1);
    const codeCopyBorder = rgbaToHex(lightPrimary, 0.3);
    const tableBorder = rgbaToHex(lightPrimary, 0.2);

    return {
      primary: rgbToHex(lightPrimary),
      secondary: rgbToHex(secondary),
      dark: rgbToHex(darkPrimary),
      background: rgbToHex(background),
      text: rgbToHex(text),
      gradientStart: rgbToHex(gradientStart),
      gradientEnd: rgbToHex(gradientEnd),
      headerBg,
      mobileMenuBg,
      cardBorder,
      codeCopyBorder,
      tableBorder,
    };
  } else {
    const primary = primaryRgb;
    const dark = adjustLightness(primary, 0.85);
    const secondary = mixWithWhite(primary, 0.88);
    const background = mixWithWhite(primary, 0.97);
    const text = { r: 74, g: 74, b: 74 };
    const gradientStart = mixWithWhite(primary, 0.75);
    const gradientEnd = { r: 255, g: 251, b: 250 };
    const headerBg = rgbaToHex(background, 0.8);
    const mobileMenuBg = rgbaToHex(background, 0.9);
    const cardBorder = rgbaToHex(primary, 0.1);
    const codeCopyBorder = rgbaToHex(primary, 0.3);
    const tableBorder = rgbaToHex(primary, 0.2);

    return {
      primary: rgbToHex(primary),
      secondary: rgbToHex(secondary),
      dark: rgbToHex(dark),
      background: rgbToHex(background),
      text: rgbToHex(text),
      gradientStart: rgbToHex(gradientStart),
      gradientEnd: rgbToHex(gradientEnd),
      headerBg,
      mobileMenuBg,
      cardBorder,
      codeCopyBorder,
      tableBorder,
    };
  }
};

const parseEnvColor = (envColor: string | undefined): RGB => {
  if (!envColor) return { r: 255, g: 105, b: 180 };
  return hexToRgb(envColor);
};

interface ColorPickerProps {
  className?: string;
}

export default function ColorPicker({ className = "" }: ColorPickerProps) {
  const { t } = useLanguage();
  const [rgb, setRgb] = useState<RGB>({ r: 255, g: 105, b: 180 });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem("custom-primary-color");
    if (savedColor) {
      const parsed = JSON.parse(savedColor);
      setRgb(parsed);
      applyColors(parsed);
    } else {
      const envColor = process.env.NEXT_PUBLIC_DEFAULT_PRIMARY_COLOR;
      const defaultRgb = parseEnvColor(envColor);
      setRgb(defaultRgb);
      applyColors(defaultRgb);
    }
  }, []);

  const applyColors = (colorRgb: RGB) => {
    const isDark = document.documentElement.classList.contains("dark");
    const colors = generateThemeColors(colorRgb, isDark);

    const root = document.documentElement;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--dark", colors.dark);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--text", colors.text);
    root.style.setProperty("--gradient-start", colors.gradientStart);
    root.style.setProperty("--gradient-end", colors.gradientEnd);
    root.style.setProperty("--header-bg", colors.headerBg);
    root.style.setProperty("--mobile-menu-bg", colors.mobileMenuBg);
    root.style.setProperty("--card-border", colors.cardBorder);
    root.style.setProperty("--code-copy-border", colors.codeCopyBorder);
    root.style.setProperty("--table-border", colors.tableBorder);

    updateBodyGradient(colors.gradientStart, colors.gradientEnd);
  };

  const updateBodyGradient = (start: string, end: string) => {
    const style = document.createElement("style");
    style.id = "theme-gradient";
    style.textContent = `
      body {
        background: linear-gradient(180deg, ${start} 0%, ${end} 80%) !important;
      }
    `;
    const existingStyle = document.getElementById("theme-gradient");
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
  };

  const handleColorChange = (channel: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    localStorage.setItem("custom-primary-color", JSON.stringify(newRgb));
    applyColors(newRgb);
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          applyColors(rgb);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [rgb]);

  const currentHex = rgbToHex(rgb);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('theme.customColor')}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: currentHex }}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 mt-2 z-50 rounded-lg shadow-lg p-4 w-72"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--secondary)",
            }}
          >
            <div className="space-y-4">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: currentHex }}
                />
                <div
                  className="text-sm font-mono"
                  style={{ color: "var(--text)" }}
                >
                  {currentHex}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div
                    className="flex justify-between text-sm mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    <span>{t('theme.red')}</span>
                    <span>{rgb.r}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) =>
                      handleColorChange("r", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #000000, #ff0000)`,
                    }}
                  />
                </div>

                <div>
                  <div
                    className="flex justify-between text-sm mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    <span>{t('theme.green')}</span>
                    <span>{rgb.g}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) =>
                      handleColorChange("g", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #000000, #00ff00)`,
                    }}
                  />
                </div>

                <div>
                  <div
                    className="flex justify-between text-sm mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    <span>{t('theme.blue')}</span>
                    <span>{rgb.b}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) =>
                      handleColorChange("b", parseInt(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #000000, #0000ff)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
