"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface GlobalDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GlobalDialog({ open, onClose, children }: GlobalDialogProps) {
  const portalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRoot.current = document.body;
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !portalRoot.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      {/* 对话框内容 */}
      <div className="relative z-10 card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>,
    portalRoot.current
  );
}
