"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  fadeUp,
  fadeUpReduced,
  SCROLL_VIEWPORT,
  staggerContainer,
} from "./motion-presets";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
};

export function ScrollReveal({ children, className, delay = 0, variants }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const motionVariants = variants ?? (reduced ? fadeUpReduced : fadeUp);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={SCROLL_VIEWPORT}
      variants={motionVariants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealStagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={SCROLL_VIEWPORT}
      variants={reduced ? { hidden: {}, visible: {} } : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div className={cn(className)} variants={reduced ? fadeUpReduced : fadeUp}>
      {children}
    </motion.div>
  );
}
