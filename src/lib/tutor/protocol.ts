// Help protocol: track attempts, provide scaffolding, never reveal answer

export type HintType = 'encouragement' | 'visual_hint' | 'simplify';

export interface HelpResponse {
  type: HintType;
  message: string;
  /** For 'simplify': a simpler version of the problem */
  simplifiedProblem?: {
    a: number;
    b: number;
    answer: number;
  };
}

export interface AttemptTracker {
  exerciseId: string;
  attempts: number;
  maxAttempts: number;
}

export function createAttemptTracker(exerciseId: string): AttemptTracker {
  return { exerciseId, attempts: 0, maxAttempts: 3 };
}

export function recordFailedAttempt(tracker: AttemptTracker): HelpResponse {
  tracker.attempts += 1;

  if (tracker.attempts === 1) {
    return {
      type: 'encouragement',
      message: pickOne([
        'Hmm, fijate bien. ¿Querés intentar de nuevo?',
        'Casi... ¡probá de nuevo!',
        'No fue esa, pero vas bien. ¡Dale otra vez!',
        'Mmm, no es esa. Pensá un poquito más 🤔',
      ]),
    };
  }

  if (tracker.attempts === 2) {
    return {
      type: 'visual_hint',
      message: pickOne([
        'Te doy una ayudita: mirá las fichas con atención 👀',
        'Fijate en los colores de las fichas, ¿te ayudan?',
        'Contá las fichas despacio, una por una',
        'Mirá bien los puntitos de cada ficha',
      ]),
    };
  }

  // 3rd attempt: simplify
  return {
    type: 'simplify',
    message: pickOne([
      'Probemos uno más fácil primero 💪',
      'Empecemos con algo más chiquito y después volvemos',
      'Hagamos un paso atrás para tomar impulso 🚀',
    ]),
  };
}

export function generateSimplifiedProblem(a: number, b: number): { a: number; b: number; answer: number } {
  // Make both numbers smaller (at least 1)
  const newA = Math.max(1, Math.min(a, Math.ceil(a / 2)));
  const newB = Math.max(1, Math.min(b, Math.ceil(b / 2)));
  return { a: newA, b: newB, answer: newA + newB };
}

export function resetAttempts(tracker: AttemptTracker): void {
  tracker.attempts = 0;
}

function pickOne(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
