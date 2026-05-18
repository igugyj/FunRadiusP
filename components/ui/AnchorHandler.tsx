"use client";

import { useEffect } from "react";

export default function AnchorHandler() {
  useEffect(() => {
    console.log("AnchorHandler initialized");

    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;

      while (target && target.tagName !== "A") {
        target = target.parentElement as HTMLElement;
      }

      if (target && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        e.stopPropagation();

        const hash = target.getAttribute("href");
        if (hash) {
          const id = hash.substring(1);
          const element = document.getElementById(id);

          if (element) {
            console.log(`Scrolling to anchor: ${id}`);

            const headerHeight = 150;
            const elementPosition =
              element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });

            history.pushState(null, "", hash);
          }
        }
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);

        if (element) {
          console.log(`Hash changed, scrolling to: ${id}`);

          const headerHeight = 150;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}
