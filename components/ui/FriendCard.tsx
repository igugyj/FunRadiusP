"use client";

import { useState, useRef, useEffect } from "react";

interface Friend {
  name: string;
  link: string | string[];
  description: string;
  avatar: string;
}

interface FriendCardProps {
  friend: Friend;
}

type PopoverPosition = "right" | "left";

export default function FriendCard({ friend }: FriendCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [popoverPosition, setPopoverPosition] =
    useState<PopoverPosition>("right");
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const links = Array.isArray(friend.link) ? friend.link : [friend.link];

  const getInitial = (name: string) => {
    if (!name) return "?";
    const firstChar = name[0];
    return firstChar.toUpperCase();
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      // 计算浮层位置
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const popoverWidth = 224; // w-56 = 224px
        const availableRight = window.innerWidth - cardRect.right;

        if (availableRight > popoverWidth + 16) {
          setPopoverPosition("right");
        } else {
          setPopoverPosition("left");
        }
      }
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative inline-block p-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={friend.name}
    >
      {/* 卡片内容 */}
      <div className="flex flex-col items-center">
        <div
          className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center mb-1"
          style={{ backgroundColor: "var(--primary)" }}
        >
          {avatarError ? (
            <span className="text-white text-xl font-bold">
              {getInitial(friend.name)}
            </span>
          ) : (
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          )}
        </div>
        <span
          className="text-xs text-center max-w-[80px] truncate"
          style={{ color: "var(--text)" }}
        >
          {friend.name}
        </span>
      </div>

      {/* 浮层 */}
      {isHovered && (
        <div
          className={`absolute z-[100] w-56 p-3 rounded-lg shadow-xl border transition-all duration-150 ${
            popoverPosition === "right"
              ? "left-[calc(100%+8px)] top-0 opacity-100"
              : "right-[calc(100%+8px)] top-0 opacity-100"
          }`}
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--secondary)",
          }}
        >
          {/* 三角形指示器 */}
          <div
            className={`absolute top-4 w-0 h-0 border-t-6 border-b-6 border-transparent ${
              popoverPosition === "right"
                ? "-left-3 border-r-6"
                : "-right-3 border-l-6"
            }`}
            style={{
              borderRightColor:
                popoverPosition === "right"
                  ? "var(--background)"
                  : "transparent",
              borderLeftColor:
                popoverPosition === "left"
                  ? "var(--background)"
                  : "transparent",
            }}
          ></div>

          <h4
            className="font-semibold mb-2 text-sm"
            style={{ color: "var(--text)" }}
          >
            {friend.name}
          </h4>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                }}
              >
                {new URL(link).hostname}
              </a>
            ))}
          </div>

          <p className="text-xs" style={{ color: "var(--text)", opacity: 0.8 }}>
            {friend.description}
          </p>
        </div>
      )}
    </div>
  );
}
