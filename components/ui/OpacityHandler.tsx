"use client";

import { useEffect } from "react";

export default function OpacityHandler() {
  useEffect(() => {
    const opacity = process.env.NEXT_PUBLIC_COMPONENT_OPACITY;
    if (opacity) {
      const parsedOpacity = parseFloat(opacity);
      if (!isNaN(parsedOpacity) && parsedOpacity >= 0 && parsedOpacity <= 1) {
        document.documentElement.style.setProperty(
          "--component-opacity",
          parsedOpacity.toString()
        );
      }
    }
  }, []);

  return null;
}
