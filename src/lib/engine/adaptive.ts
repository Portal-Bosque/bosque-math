// Adaptive difficulty engine
// 3 levels: numbers up to 5, up to 10, crossing 10

export type DifficultyLevel = 1 | 2 | 3;

export interface AdaptiveState {
  level: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}

export const LEVEL_DESCRIPTIONS: Record<DifficultyLevel, string> = {
  1: 'Números hasta 5',
  2: 'Números hasta 10',
  3: 'Cruzando la decena',
};

export function createAdaptiveState(initialLevel: DifficultyLevel = 1): AdaptiveState {
  return {
    level: initialLevel,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
  };
}

export function recordCorrect(state: AdaptiveState): AdaptiveState {
  const newCorrect = state.consecutiveCorrect + 1;
  
  // Level up after 3 consecutive correct
  if (newCorrect >= 3 && state.level < 3) {
    return {
      level: (state.level + 1) as DifficultyLevel,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
    };
  }

  return {
    ...state,
    consecutiveCorrect: newCorrect,
    consecutiveWrong: 0,
  };
}

export function recordWrong(state: AdaptiveState): AdaptiveState {
  const newWrong = state.consecutiveWrong + 1;

  // Level down after 2 consecutive wrong
  if (newWrong >= 2 && state.level > 1) {
    return {
      level: (state.level - 1) as DifficultyLevel,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
    };
  }

  return {
    ...state,
    consecutiveCorrect: 0,
    consecutiveWrong: newWrong,
  };
}

/** Get max number for current level */
export function getMaxNumber(level: DifficultyLevel): number {
  switch (level) {
    case 1: return 5;
    case 2: return 10;
    case 3: return 15;
  }
}

/** Generate a random number pair appropriate for the level */
export function generatePair(level: DifficultyLevel): { a: number; b: number } {
  switch (level) {
    case 1: {
      const a = randInt(1, 4);
      const b = randInt(1, 5 - a);
      return { a, b };
    }
    case 2: {
      const a = randInt(1, 8);
      const b = randInt(1, 10 - a);
      return { a, b };
    }
    case 3: {
      // Crossing 10: sum > 10
      const a = randInt(5, 9);
      const b = randInt(10 - a + 1, 9);
      return { a, b };
    }
  }
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
