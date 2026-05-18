"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { detectOS, detectBrowser } from "@/lib/device-detector";

export default function VisitorGreeting() {
  const { t } = useLanguage();
  const [os, setOs] = useState("Unknown OS");
  const [browser, setBrowser] = useState("Unknown Browser");

  useEffect(() => {
    setOs(detectOS());
    setBrowser(detectBrowser());
  }, []);

  return (
    <p
      className="text-sm text-center mb-8 opacity-70"
      style={{
        animation: "float 3s ease-in-out infinite",
      }}
    >
      {t('greeting.welcome', { os, browser })}
    </p>
  );
}
