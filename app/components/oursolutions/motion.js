export const FADE_UP = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

export const motionProps = (delay = 0) => ({
  variants: FADE_UP,
  initial: "hidden",
  animate: "visible",
  transition: { duration: 0.5, delay },
});
