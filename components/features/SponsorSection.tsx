// components/features/SponsorSection.tsx
export default function SponsorSection() {
  return (
    <details className="my-8">
      <summary className="cursor-pointer">Sponsor</summary>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* 左 50% */}
        <div style={{ width: "50%", textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/sponsorEmoji.png"
            alt="Sponsor emoji"
            style={{
              width: 190,
              borderRadius: 12,
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* 右 50% */}
        <div style={{ width: "50%", textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/wechatSponsor.png"
            alt="WeChat Sponsor"
            style={{
              width: 180,
              borderRadius: 12,
              display: "block",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: 6, marginBottom: 0 }}>WeChat</p>
        </div>
      </div>

      {/* 爱发电徽章 */}
      <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
        <a
          href="https://afdian.com/a/pfolg"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 999,
            backgroundColor: "#fff",
            border: "1.5px solid #946ce6",
            color: "#946ce6",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://static.afdiancdn.com/static/img/logo/logo.png"
            alt="爱发电"
            width={20}
            height={20}
            style={{ display: "block", flexShrink: 0 }}
          />
          爱发电
        </a>
      </div>
    </details>
  );
}