"use client";

import { useEffect, useState } from "react";

const VISIBILITY_THRESHOLD = 300;

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > VISIBILITY_THRESHOLD);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleScrollToTop}
      className={`fixed right-6 bottom-6 z-50 cursor-pointer rounded-full border border-zinc-500/70 bg-zinc-900/80 p-3 text-zinc-100 shadow-md backdrop-blur transition-all duration-200 hover:border-amber-300 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
        isVisible ? "translate-y-0 opacity-70" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
