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
    </details>
  );
}
