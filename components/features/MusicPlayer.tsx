"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

interface MusicPlayerProps {
  player: {
    source: "netease" | "local";
    link: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    autoPlay?: boolean;
  };
}

export default function MusicPlayer({ player }: MusicPlayerProps) {
  // console.log("MusicPlayer component rendered with player:", player);
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname;
    const postIdMatch = pathname.match(/\/posts\/(.*?)(\/|$)/);
    const id = postIdMatch ? postIdMatch[1] : "";
    setPostId(id);
  }, []);

  useEffect(() => {
    if (player.autoPlay !== false && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Autoplay failed:", error);
        });
    }
  }, [player.autoPlay, postId]);

  const getNeteaseUrl = (link: string, autoPlay?: boolean): string => {
    const shouldAutoPlay = autoPlay !== false ? 1 : 0;
    if (link.startsWith("http")) {
      return link;
    } else if (link.startsWith("//")) {
      return `https:${link}`;
    } else if (/^\d+$/.test(link)) {
      return `https://music.163.com/outchain/player?type=2&id=${link}&auto=${shouldAutoPlay}&height=66`;
    } else {
      return link;
    }
  };

  const getLocalUrl = (link: string, postId: string): string => {
    if (link.startsWith("http")) {
      return link;
    } else if (link.startsWith("/")) {
      return link;
    } else if (link.startsWith("assets/")) {
      return `/posts/${postId}/${link}`;
    } else {
      return `/posts/${postId}/assets/${link}`;
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Play failed:", error);
          });
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  if (player.top) {
    containerStyle.top = player.top;
  } else if (player.bottom) {
    containerStyle.bottom = player.bottom;
  } else {
    containerStyle.bottom = "40px";
  }

  if (player.left) {
    containerStyle.left = player.left;
  } else if (player.right) {
    containerStyle.right = player.right;
  } else {
    containerStyle.left = "40px";
  }
  containerStyle.transform = "none";

  const commonButtonStyle: React.CSSProperties = {
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
    color: "var(--primary)",
  };

  const getPlayerContainerStyle = (isNetease: boolean) => {
    return {
      ...containerStyle,
      padding: isExpanded ? "12px" : "8px",
      minWidth: isExpanded ? "370px" : "48px",
      minHeight: isExpanded ? (isNetease ? "120px" : "100px") : "48px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(0, 0, 0, 0.1)",
    };
  };

  if (player.source === "netease") {
    const neteaseUrl = getNeteaseUrl(player.link, player.autoPlay);
    // console.log("Netease player URL:", neteaseUrl);
    return (
      <div style={getPlayerContainerStyle(true)} className="netease-player">
        <div
          onClick={toggleExpand}
          style={{
            ...commonButtonStyle,
            marginRight: isExpanded ? "10px" : "0",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <iframe
          src={neteaseUrl}
          width="330"
          height="86"
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
          title="网易云音乐播放器"
          style={{
            borderRadius: "4px",
            display: isExpanded ? "block" : "none",
          }}
        ></iframe>
      </div>
    );
  } else if (player.source === "local") {
    const localUrl = getLocalUrl(player.link, postId);
    // console.log("Local player URL:", localUrl);

    return (
      <div style={getPlayerContainerStyle(true)} className="local-player">
        <audio
          ref={audioRef}
          src={localUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => console.error("Audio error:", e)}
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
          }}
        />
        <div
          onClick={toggleExpand}
          style={{
            ...commonButtonStyle,
            marginRight: isExpanded ? "10px" : "0",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        {isExpanded && (
          <div
            style={{
              width: "330px",
              padding: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              borderRadius: "6px",
            }}
          >
            <audio
              src={localUrl}
              onPlay={() => {
                setIsPlaying(true);
                if (audioRef.current) {
                  audioRef.current.play().catch(() => {});
                }
              }}
              onPause={() => {
                setIsPlaying(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                }
              }}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  const visibleAudio = document.querySelector(
                    ".local-player audio:not([style*='left: -9999px'])",
                  ) as HTMLAudioElement;
                  if (
                    visibleAudio &&
                    Math.abs(
                      visibleAudio.currentTime - audioRef.current.currentTime,
                    ) > 0.5
                  ) {
                    audioRef.current.currentTime = visibleAudio.currentTime;
                  }
                }
              }}
              onError={(e) => console.error("Audio error:", e)}
              style={{
                width: "100%",
              }}
              controls
            >
              {t("musicPlayer.browserNotSupport")}
            </audio>
          </div>
        )}
      </div>
    );
  }

  return null;
}
