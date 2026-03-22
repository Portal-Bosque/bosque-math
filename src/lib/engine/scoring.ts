// Score a session and determine advancement

export interface SessionResult {
  total: number;
  correct: number;
  percentage: number;
  canAdvance: boolean;
  message: string;
}

export function scoreSession(correct: number, total: number = 8): SessionResult {
  const percentage = Math.round((correct / total) * 100);

  if (correct >= 6) {
    return {
      total,
      correct,
      percentage,
      canAdvance: true,
      message: '¡Genial! Podés avanzar a la siguiente lección 🌟',
    };
  }

  if (correct >= 4) {
    return {
      total,
      correct,
      percentage,
      canAdvance: false,
      message: '¡Muy bien! ¿Querés practicar un poco más? 💪',
    };
  }

  return {
    total,
    correct,
    percentage,
    canAdvance: false,
    message: '¡Seguí practicando! Cada vez sale mejor 🚀',
  };
}
