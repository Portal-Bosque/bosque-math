// =============================================================================
// Bosque Math v2 — Adaptive Difficulty Engine
// Level 1: numbers up to 5 | Level 2: up to 10 | Level 3: crossing 10
// =============================================================================

export type AdaptiveLevel = 1 | 2 | 3;

export interface AdaptiveState {
  level: AdaptiveLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  totalCorrect: number;
  totalAttempts: number;
}

const LEVEL_UP_THRESHOLD = 3;   // 3 consecutive correct → level up
const LEVEL_DOWN_THRESHOLD = 2; // 2 consecutive wrong → level down

/** Create initial adaptive state */
export function createAdaptiveState(startLevel: AdaptiveLevel = 1): AdaptiveState {
  return {
    level: startLevel,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}

/** Record a result and return updated state */
export function recordResult(state: AdaptiveState, correct: boolean): AdaptiveState {
  const next = { ...state };
  next.totalAttempts++;

  if (correct) {
    next.totalCorrect++;
    next.consecutiveCorrect++;
    next.consecutiveWrong = 0;

    // Level up?
    if (next.consecutiveCorrect >= LEVEL_UP_THRESHOLD && next.level < 3) {
      next.level = (next.level + 1) as AdaptiveLevel;
      next.consecutiveCorrect = 0;
    }
  } else {
    next.consecutiveWrong++;
    next.consecutiveCorrect = 0;

    // Level down?
    if (next.consecutiveWrong >= LEVEL_DOWN_THRESHOLD && next.level > 1) {
      next.level = (next.level - 1) as AdaptiveLevel;
      next.consecutiveWrong = 0;
    }
  }

  return next;
}

/** Get the max number for the current level */
export function getMaxNumber(level: AdaptiveLevel): number {
  switch (level) {
    case 1: return 5;
    case 2: return 10;
    case 3: return 15; // crossing 10
  }
}

/** Get a description of the level for logging/UI */
export function getLevelDescription(level: AdaptiveLevel): string {
  switch (level) {
    case 1: return 'Números hasta 5';
    case 2: return 'Números hasta 10';
    case 3: return 'Cruzando el 10';
  }
}

/** Calculate session accuracy */
export function getAccuracy(state: AdaptiveState): number {
  if (state.totalAttempts === 0) return 0;
  return Math.round((state.totalCorrect / state.totalAttempts) * 100);
}
