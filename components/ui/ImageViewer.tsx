"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface ImageViewerContextType {
  isOpen: boolean;
  currentImage: string;
  currentAlt: string;
  openViewer: (src: string, alt: string) => void;
  closeViewer: () => void;
}

const ImageViewerContext = createContext<ImageViewerContextType | undefined>(
  undefined,
);

export function ImageViewerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [currentAlt, setCurrentAlt] = useState("");

  const openViewer = useCallback((src: string, alt: string) => {
    setCurrentImage(src);
    setCurrentAlt(alt);
    setIsOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setCurrentImage("");
    setCurrentAlt("");
  }, []);

  // 添加 ESC 键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeViewer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeViewer]);

  return (
    <ImageViewerContext.Provider
      value={{
        isOpen,
        currentImage,
        currentAlt,
        openViewer,
        closeViewer,
      }}
    >
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
          onClick={closeViewer}
        >
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
          <img
            src={currentImage}
            alt={currentAlt}
            className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </ImageViewerContext.Provider>
  );
}

export function useImageViewer() {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error(
      "useImageViewer must be used within an ImageViewerProvider",
    );
  }
  return context;
}
