"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PROGRESS_RADIUS = 25;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

      setVisible(window.scrollY > 500);
      setProgress(Math.min(1, Math.max(0, nextProgress)));
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Sayfanın başına dön"
      className={cn(
        "group fixed right-3 bottom-[4.5rem] z-50 inline-flex size-12 items-center justify-center rounded-full bg-[#222222]/85 text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2d2d2d]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:right-4 sm:bottom-20 sm:size-14",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <circle
          cx="28"
          cy="28"
          r={PROGRESS_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-white/15"
        />
        <circle
          cx="28"
          cy="28"
          r={PROGRESS_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={PROGRESS_CIRCUMFERENCE}
          strokeDashoffset={PROGRESS_CIRCUMFERENCE * (1 - progress)}
          className="text-primary drop-shadow-[0_0_3px_currentColor] transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>
      <ChevronUp
        className="relative size-5 transition-transform duration-200 group-hover:-translate-y-0.5 sm:size-6"
        aria-hidden="true"
      />
    </button>
  );
}
