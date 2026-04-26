"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 520);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="回到顶部"
      onClick={handleClick}
      className={`fixed bottom-12 right-6 z-40 lg:right-[max(1.5rem,calc(50%-600px))] transition duration-300 hover:scale-110 cursor-pointer ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-8 w-8"
        fill="currentColor"
      >
        <polygon points="50,20 85,75 15,75" className="text-primary" />
      </svg>
    </button>
  );
}
