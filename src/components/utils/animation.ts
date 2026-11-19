import type { Variants } from "framer-motion";

export const fadeUpVariants = (
  reduceMotion: boolean | null,
  distance: number = 20,
  duration: number = 0.45,
  visibleVariant: string = "visible",
): Variants => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : distance },
  [visibleVariant]: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: "easeOut" },
  },
});

export const staggerVariants = (
  reduceMotion: boolean | null,
  stagger: number = 0.1,
  visibleVariant: string = "visible",
): Variants => ({
  hidden: {},
  [visibleVariant]: {
    transition: { staggerChildren: reduceMotion ? 0 : stagger },
  },
});

export const fadeScaleVariants = (
  reduceMotion: boolean | null,
  initialScale: number = 0.96,
  duration: number = 0.8,
  delay: number = 0,
): Variants => ({
  hidden: { opacity: 0, scale: reduceMotion ? 1 : initialScale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, ease: "easeOut", delay },
  },
});
