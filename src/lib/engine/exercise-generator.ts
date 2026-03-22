// Exercise generator for each lesson type

import { type DifficultyLevel, generatePair } from './adaptive';

export type ExerciseType =
  | 'subitizing'
  | 'tile_sum'
  | 'direct_sum'
  | 'multiple_choice'
  | 'true_false'
  | 'missing_number';

export interface Exercise {
  id: string;
  type: ExerciseType;
  /** Numbers involved */
  a: number;
  b: number;
  /** Correct answer */
  answer: number;
  /** For multiple choice: options */
  options?: number[];
  /** For true/false: the proposed (possibly wrong) answer */
  proposedAnswer?: number;
  /** For missing number: which is hidden — 'a' | 'b' | 'answer' */
  missingPart?: 'a' | 'b' | 'answer';
  /** Display instruction */
  instruction: string;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Generate a unique exercise ID */
let exerciseCounter = 0;
function nextId(type: string): string {
  return `${type}-${Date.now()}-${exerciseCounter++}`;
}

/** Generate options for multiple choice (includes correct answer) */
function generateOptions(correct: number, count: number = 4): number[] {
  const opts = new Set<number>([correct]);
  const min = Math.max(0, correct - 3);
  const max = correct + 3;
  while (opts.size < count) {
    const v = randInt(min, max);
    if (v !== correct && v >= 0) opts.add(v);
  }
  return shuffle([...opts]);
}

// --- Lesson-specific generators ---

export function generateSubitizingExercise(): Exercise {
  const n = randInt(1, 10);
  return {
    id: nextId('subit'),
    type: 'subitizing',
    a: n,
    b: 0,
    answer: n,
    options: generateOptions(n, 4),
    instruction: '¿Cuántos puntitos ves?',
  };
}

export function generateTileSumExercise(level: DifficultyLevel): Exercise {
  const { a, b } = generatePair(level);
  return {
    id: nextId('tilesum'),
    type: 'tile_sum',
    a,
    b,
    answer: a + b,
    instruction: `Arrastrá fichas para hacer ${a + b}`,
  };
}

export function generateDirectSumExercise(level: DifficultyLevel): Exercise {
  const { a, b } = generatePair(level);
  return {
    id: nextId('direct'),
    type: 'direct_sum',
    a,
    b,
    answer: a + b,
    instruction: `¿Cuánto es ${a} + ${b}?`,
  };
}

export function generateMultipleChoiceExercise(level: DifficultyLevel): Exercise {
  const { a, b } = generatePair(level);
  const answer = a + b;
  return {
    id: nextId('mc'),
    type: 'multiple_choice',
    a,
    b,
    answer,
    options: generateOptions(answer, 4),
    instruction: `${a} + ${b} = ?`,
  };
}

export function generateTrueFalseExercise(level: DifficultyLevel): Exercise {
  const { a, b } = generatePair(level);
  const answer = a + b;
  // 50% chance of showing wrong answer
  const isCorrect = Math.random() > 0.5;
  const proposed = isCorrect ? answer : answer + randInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
  return {
    id: nextId('tf'),
    type: 'true_false',
    a,
    b,
    answer: isCorrect ? 1 : 0, // 1 = true, 0 = false
    proposedAnswer: proposed,
    instruction: `¿Es verdad que ${a} + ${b} = ${proposed}?`,
  };
}

export function generateMissingNumberExercise(level: DifficultyLevel): Exercise {
  const { a, b } = generatePair(level);
  const answer = a + b;
  const parts: Array<'a' | 'b' | 'answer'> = ['a', 'b', 'answer'];
  const missingPart = parts[Math.floor(Math.random() * parts.length)];
  
  let instruction: string;
  let correctAnswer: number;
  switch (missingPart) {
    case 'a':
      instruction = `? + ${b} = ${answer}`;
      correctAnswer = a;
      break;
    case 'b':
      instruction = `${a} + ? = ${answer}`;
      correctAnswer = b;
      break;
    case 'answer':
      instruction = `${a} + ${b} = ?`;
      correctAnswer = answer;
      break;
  }

  return {
    id: nextId('missing'),
    type: 'missing_number',
    a,
    b,
    answer: correctAnswer,
    missingPart,
    instruction,
  };
}

/** Generate a full session of 8 exercises for a lesson */
export function generateSession(lessonId: number, level: DifficultyLevel): Exercise[] {
  const exercises: Exercise[] = [];

  switch (lessonId) {
    case 0: // Subitizing
      for (let i = 0; i < 8; i++) {
        exercises.push(generateSubitizingExercise());
      }
      break;

    case 1: // Juntamos — tile-based
      for (let i = 0; i < 8; i++) {
        exercises.push(generateTileSumExercise(level));
      }
      break;

    case 2: // Sumas hasta 5 — mixed types
    default: {
      const generators = [
        () => generateDirectSumExercise(level),
        () => generateMultipleChoiceExercise(level),
        () => generateMissingNumberExercise(level),
        () => generateTrueFalseExercise(level),
        () => generateTileSumExercise(level),
      ];
      
      // Ensure variety: no more than 2 of same type in a row
      let lastType: ExerciseType | null = null;
      let sameTypeCount = 0;

      for (let i = 0; i < 8; i++) {
        let ex: Exercise;
        let attempts = 0;
        do {
          const gen = generators[Math.floor(Math.random() * generators.length)];
          ex = gen();
          attempts++;
        } while (ex.type === lastType && sameTypeCount >= 2 && attempts < 10);

        if (ex.type === lastType) {
          sameTypeCount++;
        } else {
          sameTypeCount = 1;
          lastType = ex.type;
        }

        exercises.push(ex);
      }
      break;
    }
  }

  return exercises;
}
