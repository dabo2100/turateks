"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { MOTION_EASE } from "./motion-presets";

export type StatConfig = {
  end?: number;
  suffix?: string;
  text?: string;
  label: string;
};

export function StatCounterCard({
  stat,
  index,
  startImmediately = false,
}: {
  stat: StatConfig;
  index: number;
  startImmediately?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35, margin: "-24px 0px" });
  const shouldAnimate = startImmediately || isInView;
  const reduced = useReducedMotion();
  const finalLabel = stat.text ?? `${stat.end ?? 0}${stat.suffix ?? ""}`;
  const [display, setDisplay] = useState(reduced ? finalLabel : stat.text ?? "0");

  useEffect(() => {
    if (stat.text) {
      setDisplay(stat.text);
      return;
    }
    if (stat.end == null) return;

    if (reduced || !shouldAnimate) {
      if (shouldAnimate || reduced) setDisplay(finalLabel);
      return;
    }

    setDisplay(`0${stat.suffix ?? ""}`);
    const controls = animate(0, stat.end, {
      duration: 1.75,
      delay: index * 0.1,
      ease: MOTION_EASE,
      onUpdate: (value) => setDisplay(`${Math.round(value)}${stat.suffix ?? ""}`),
    });

    return () => controls.stop();
  }, [shouldAnimate, stat.end, stat.suffix, stat.text, index, reduced, finalLabel]);

  return (
    <motion.div
      ref={ref}
      className="rounded-xl border border-white/15 bg-black/40 p-3 shadow-lg shadow-black/20 backdrop-blur-md sm:p-4"
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.97 }}
      animate={shouldAnimate || reduced ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.45, delay: index * 0.08, ease: MOTION_EASE }}
    >
      <p className="text-xl font-semibold text-primary tabular-nums sm:text-2xl lg:text-3xl">{display}</p>
      <p className="mt-1 text-[11px] leading-4 text-white/70 sm:text-xs sm:leading-5">{stat.label}</p>
    </motion.div>
  );
}
