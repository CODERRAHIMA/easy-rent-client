/**
 * @param {boolean | null} reduceMotion
 * @param {number} distance
 * @param {number} duration
 * @param {string} visibleVariant
 * @returns {import("framer-motion").Variants}
 */
export const fadeUpVariants = (
  reduceMotion,
  distance = 20,
  duration = 0.45,
  visibleVariant = "visible",
) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : distance },
  [visibleVariant]: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: "easeOut" },
  },
});

/**
 * @param {boolean | null} reduceMotion
 * @param {number} stagger
 * @param {string} visibleVariant
 * @returns {import("framer-motion").Variants}
 */
export const staggerVariants = (
  reduceMotion,
  stagger = 0.1,
  visibleVariant = "visible",
) => ({
  hidden: {},
  [visibleVariant]: {
    transition: { staggerChildren: reduceMotion ? 0 : stagger },
  },
});

/**
 * @param {boolean | null} reduceMotion
 * @param {number} initialScale
 * @param {number} duration
 * @param {number} delay
 * @returns {import("framer-motion").Variants}
 */
export const fadeScaleVariants = (
  reduceMotion,
  initialScale = 0.96,
  duration = 0.8,
  delay = 0,
) => ({
  hidden: { opacity: 0, scale: reduceMotion ? 1 : initialScale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, ease: "easeOut", delay },
  },
});
