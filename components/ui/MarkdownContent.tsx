"use client";

import { useEffect, useRef } from "react";
import { useImageViewer } from "./ImageViewer";

interface MarkdownContentProps {
  html: string;
}

export default function MarkdownContent({ html }: MarkdownContentProps) {
  const { openViewer } = useImageViewer();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // 设置所有图片的 cursor
    const images = content.querySelectorAll("img");
    images.forEach((img) => {
      img.style.cursor = "zoom-in";
    });

    // 使用事件委托处理点击
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const img = target.closest("img");
      if (img) {
        e.preventDefault();
        openViewer(img.src, img.alt || "");
      }
    };

    content.addEventListener("click", handleClick);

    return () => {
      content.removeEventListener("click", handleClick);
    };
  }, [html, openViewer]);

  return (
    <div
      ref={contentRef}
      className="prose max-w-none mb-8 post-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
