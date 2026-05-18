"use client";
// components/ProfileCard.tsx
import { FaGithub, FaSteam } from "react-icons/fa";
// 从 react-icons/si (Simple Icons) 导入品牌图标
import { SiBilibili, SiGitee } from "react-icons/si";

export default function ProfileCard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 900,
        margin: "20px auto",
        padding: 12,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <video
          src="/fln.mp4"
          autoPlay
          muted
          loop
          playsInline
          controlsList="nodownload" // 隐藏下载按钮
          onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
          style={{
            width: 200,
            height: 200,
            borderRadius: 20,
            objectFit: "cover",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            border: "1px solid #e9edf2",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 18px",
          justifyContent: "center",
        }}
      >
        {/* Bilibili - 使用 Simple Icons 的 SiBilibili */}
        <a
          href="https://space.bilibili.com/515553532"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            fontWeight: 500,
            background: "#f0f4f9",
            padding: "6px 18px",
            borderRadius: 40,
            color: "#00A1D6",
          }}
        >
          <SiBilibili size={16} /> Bilibili
        </a>
        {/* GitHub (csy214) - 保持不变，使用 Font Awesome */}
        <a
          href="https://github.com/igugyj"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            fontWeight: 500,
            background: "#f0f4f9",
            padding: "6px 18px",
            borderRadius: 40,
            color: "#24292f",
          }}
        >
          <FaGithub size={16} /> GitHub
        </a>
        {/* Steam - 保持不变，使用 Font Awesome */}
        <a
          href="https://steamcommunity.com/profiles/76561199677607305/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            fontWeight: 500,
            background: "#f0f4f9",
            padding: "6px 18px",
            borderRadius: 40,
            color: "#1b2838",
          }}
        >
          <FaSteam size={16} /> Steam
        </a>
        {/* Gitee - 使用 Simple Icons 的 SiGitee */}
        <a
          href="https://gitee.com/Pfolg"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            fontWeight: 500,
            background: "#f0f4f9",
            padding: "6px 18px",
            borderRadius: 40,
            color: "#c71d23",
          }}
        >
          <SiGitee size={16} /> Gitee
        </a>
      </div>
    </div>
  );
}
