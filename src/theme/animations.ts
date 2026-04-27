import type { WithSpringConfig } from 'react-native-reanimated';

/**
 * Bouncy spring — used for playful press feedback and list item entrances.
 * Low damping produces visible overshoot.
 */
export const SPRING_BOUNCY: WithSpringConfig = {
  damping: 12,
  stiffness: 180,
  mass: 0.5,
};

/**
 * Stiff spring — used for snappy UI transitions that settle quickly.
 * High stiffness + damping eliminates overshoot.
 */
export const SPRING_STIFF: WithSpringConfig = {
  damping: 20,
  stiffness: 300,
};

/**
 * Gentle spring — used for subtle background animations and opacity fades.
 * Low stiffness makes motion feel unhurried.
 */
export const SPRING_GENTLE: WithSpringConfig = {
  damping: 15,
  stiffness: 120,
};

/**
 * Modal enter spring — used for iOS-style cards that pop in with controlled
 * momentum and a small amount of overshoot.
 */
export const SPRING_MODAL_ENTER: WithSpringConfig = {
  damping: 18,
  stiffness: 240,
  mass: 0.9,
  velocity: 2.4,
};

/**
 * Modal exit spring — used for quick dismissals that still feel physical but
 * settle faster than the enter transition.
 */
export const SPRING_MODAL_EXIT: WithSpringConfig = {
  damping: 24,
  stiffness: 320,
  mass: 0.85,
  velocity: -2,
};
