'use client'

import { useState } from 'react'
import SafeImage from "./SafeImage";

interface ExpandableCoverProps {
  image: string
  alt: string
}

export default function ExpandableCover({ image, alt }: ExpandableCoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="mb-8 w-full rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer p-3 hover:opacity-80 transition-opacity select-none flex items-center justify-center"
        style={{
          backgroundColor: "var(--secondary)",
          color: "var(--text)",
          border: "1px solid rgba(255, 105, 180, 0.1)",
          borderTopLeftRadius: "0.75rem",
          borderTopRightRadius: "0.75rem",
          borderBottomLeftRadius: isOpen ? "0" : "0.75rem",
          borderBottomRightRadius: isOpen ? "0" : "0.75rem",
        }}
      >
        <svg
          className={`w-4 h-4 mr-2 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span className="font-medium text-sm whitespace-nowrap">
          {isOpen ? "点击收起封面" : "点击展开封面"}
        </span>
      </button>
      {isOpen && (
        <div
          className="p-4"
          style={{
            backgroundColor: "var(--secondary)",
            border: "1px solid rgba(255, 105, 180, 0.1)",
            borderTop: "none",
            borderBottomLeftRadius: "0.75rem",
            borderBottomRightRadius: "0.75rem",
          }}
        >
          <div
            className="rounded-lg overflow-hidden"
            style={{
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              backgroundColor: "var(--secondary)",
            }}
          >
            <SafeImage
              src={image}
              alt={alt}
              className="w-full h-auto max-h-[600px] object-contain mx-auto"
              clickable={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
