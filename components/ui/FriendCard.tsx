"use client";

import { useState } from "react";

interface Friend {
  name: string;
  link: string | string[];
  description: string;
  avatar: string;
}

interface FriendCardProps {
  friend: Friend;
}

const DEFAULT_AVATAR = "/default_head.png";

export default function FriendCard({ friend }: FriendCardProps) {
  const [avatarError, setAvatarError] = useState(false);

  const links = Array.isArray(friend.link) ? friend.link : [friend.link];

  const avatarSrc =
    !friend.avatar || avatarError ? DEFAULT_AVATAR : friend.avatar;

  return (
    <div className="friend-card">
      <div
        className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <img
          src={avatarSrc}
          alt={friend.name}
          className="w-full h-full object-cover"
          onError={() => setAvatarError(true)}
        />
      </div>

      <div className="friend-details">
        <h4 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          {friend.name}
        </h4>

        <div className="flex flex-wrap gap-1.5">
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

        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: "var(--text)", opacity: 0.75 }}
        >
          {friend.description}
        </p>
      </div>
    </div>
  );
}
