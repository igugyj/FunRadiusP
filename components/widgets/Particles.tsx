"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { fallingCreate } from "natural-falling-js";

type EffectType = "petal" | "leaf" | "rain" | "snow" | "auto";

const getSeason = (): EffectType => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "petal";
  if (month >= 6 && month <= 8) return "rain";
  if (month >= 9 && month <= 11) return "leaf";
  return "snow";
};

const getConfig = () => {
  const type =
    (process.env.NEXT_PUBLIC_PARTICLES_TYPE as EffectType) || "petal";
  const effectType = type === "auto" ? getSeason() : type;
  const count = parseInt(process.env.NEXT_PUBLIC_PARTICLES_COUNT || "50");
  const zIndex = parseInt(process.env.NEXT_PUBLIC_PARTICLES_ZINDEX || "0");
  const enabled = process.env.NEXT_PUBLIC_PARTICLES_ENABLED !== "false";

  const imgNumSetting: number[] = [40, 40, 80, 60];
  const imgSetting: string[] = [];

  switch (effectType) {
    case "petal":
      imgSetting.push("petal");
      imgNumSetting[0] = count;
      break;
    case "leaf":
      imgSetting.push("leaf");
      imgNumSetting[1] = count;
      break;
    case "rain":
      imgSetting.push("rain");
      imgNumSetting[3] = count;
      break;
    case "snow":
      imgSetting.push("snow");
      imgNumSetting[2] = count;
      break;
    default:
      break;
  }

  return {
    open: enabled,
    imgSetting,
    imgNumSetting,
    zIndex,
  };
};

export default function Particles() {
  const pathname = usePathname();
  const effectRef = useRef<any>(null);

  useEffect(() => {
    if (pathname === "/docs/" || pathname?.startsWith("/docs/")) {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
      return;
    }

    const config = getConfig();
    if (!config.open) return;

    if (!effectRef.current) {
      effectRef.current = fallingCreate(config);
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
