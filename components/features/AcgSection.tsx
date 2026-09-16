// components/features/AcgSection.tsx
export default function AcgSection() {
  return (
    <details className="my-8">
      <summary className="cursor-pointer font-bold">ACG</summary>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <a
          href="http://bangumi.tv/user/1203969"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://bgm.tv/chart/img/1203969"
            alt="pfg 的个人主页"
            referrerPolicy="no-referrer"
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "auto",
              border: 0,
            }}
          />
        </a>
      </div>
    </details>
  );
}
