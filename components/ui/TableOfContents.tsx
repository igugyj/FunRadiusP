"use client";

import { useState, useEffect } from "react";

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  useEffect(() => {
    // 从 HTML 中提取标题
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3, h4, h5, h6");

    const extractedHeadings = Array.from(headingElements).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName.substring(1)),
    }));

    setHeadings(extractedHeadings);

    // 监听滚动，高亮当前章节
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 80; // 调整偏移量

      for (let i = extractedHeadings.length - 1; i >= 0; i--) {
        const heading = extractedHeadings[i];
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(heading.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [content]);

  if (headings.length === 0) return <p className="text-gray-500">无目录</p>;

  return (
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li key={heading.id} className={`pl-${(heading.level - 2) * 4}`}>
          <a
            href={`#${heading.id}`}
            className={`block py-1 text-sm ${activeHeading === heading.id ? "text-primary font-semibold" : "text-gray-600 hover:text-primary"}`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
