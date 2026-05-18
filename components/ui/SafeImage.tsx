"use client";

import { useState } from "react";
import { useImageViewer } from "./ImageViewer";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  clickable?: boolean;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  clickable = false,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const { openViewer } = useImageViewer();

  if (hasError) {
    return null;
  }

  const handleClick = () => {
    if (clickable) {
      openViewer(src, alt);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${clickable ? "cursor-zoom-in" : ""}`}
      loading={loading}
      onError={() => setHasError(true)}
      onClick={handleClick}
    />
  );
}
