"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.round(value * 100);
    setPercent((prev) => (prev === next ? prev : next));
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
      className="absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-primary-hover via-primary to-primary shadow-[0_0_12px_rgba(227,24,55,0.6)]"
    />
  );
}