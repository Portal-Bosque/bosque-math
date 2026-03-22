// =============================================================================
// Bosque Math v2 — Exercise Generator
// Takes a TutoriaConfig + adaptive level, produces a session of exercises
// 8 exercises + 2 review exercises, with variety enforcement
// =============================================================================

import type { Exercise, ExerciseType, TutoriaConfig } from '../types';
import type { AdaptiveLevel } from './adaptive';
import { getMaxNumber } from './adaptive';
import { getSpacedRepetitionState } from '../storage';

const EXERCISES_PER_SESSION = 8;
const REVIEW_EXERCISES = 2;

/** Generate a full session of exercises for a tutoria */
export function generateSession(
  tutoria: TutoriaConfig,
  level: AdaptiveLevel,
  includeReview: boolean = true
): Exercise[] {
  const exercisePhase = tutoria.fases.find((f) => f.tipo === 'ejercicios');
  const types = exercisePhase?.tipos ?? ['suma_directa', 'multiple_choice'];
  const maxNum = getMaxNumber(level);

  // Generate main exercises
  const exercises: Exercise[] = [];
  for (let i = 0; i < EXERCISES_PER_SESSION; i++) {
    const type = pickTypeWithVariety(types, exercises);
    const exercise = generateExercise(
      `${tutoria.tutoriaId}-${i}`,
      type,
      maxNum,
      level,
      tutoria.tutoriaId
    );
    exercises.push(exercise);
  }

  // Add review exercises from spaced repetition
  if (includeReview && tutoria.spacedRepetition.conceptosARepasar.length > 0) {
    const reviewExercises = generateReviewFromConfig(
      tutoria,
      level,
      REVIEW_EXERCISES
    );
    exercises.push(...reviewExercises);
  }

  return exercises;
}

/** Pick a type ensuring no more than 2 in a row */
function pickTypeWithVariety(
  types: ExerciseType[],
  existing: Exercise[]
): ExerciseType {
  const lastTwo = existing.slice(-2).map((e) => e.type);

  if (lastTwo.length === 2 && lastTwo[0] === lastTwo[1]) {
    // Last 2 are same type — pick a different one
    const filtered = types.filter((t) => t !== lastTwo[0]);
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return types[Math.floor(Math.random() * types.length)];
}

/** Generate a single exercise based on type and level */
function generateExercise(
  id: string,
  type: ExerciseType,
  maxNum: number,
  level: AdaptiveLevel,
  fromTutoria?: string
): Exercise {
  switch (type) {
    case 'suma_directa':
      return generateSumaDirecta(id, maxNum, fromTutoria);
    case 'multiple_choice':
      return generateMultipleChoice(id, maxNum, fromTutoria);
    case 'fichas':
      return generateFichas(id, maxNum, fromTutoria);
    case 'verdadero_falso':
      return generateVerdaderoFalso(id, maxNum, fromTutoria);
    case 'numero_faltante':
      return generateNumeroFaltante(id, maxNum, fromTutoria);
    case 'subitizing':
      return generateSubitizing(id, maxNum, fromTutoria);
    default:
      return generateSumaDirecta(id, maxNum, fromTutoria);
  }
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateSumaDirecta(id: string, maxNum: number, fromTutoria?: string): Exercise {
  const a = rand(0, maxNum);
  const b = rand(0, maxNum - a);
  return {
    id,
    type: 'suma_directa',
    question: `¿Cuánto es ${a} + ${b}?`,
    correctAnswer: a + b,
    equation: `${a} + ${b}`,
    fromTutoria,
  };
}

function generateMultipleChoice(id: string, maxNum: number, fromTutoria?: string): Exercise {
  const a = rand(1, maxNum);
  const b = rand(0, maxNum - a);
  const correct = a + b;
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 2) {
    const wrong = correct + rand(-2, 2);
    if (wrong !== correct && wrong >= 0 && wrong <= maxNum * 2) {
      wrongOptions.add(wrong);
    }
  }
  const options = shuffle([correct, ...wrongOptions]);
  return {
    id,
    type: 'multiple_choice',
    question: `¿Cuánto es ${a} + ${b}?`,
    correctAnswer: correct,
    options,
    equation: `${a} + ${b}`,
    fromTutoria,
  };
}

function generateFichas(id: string, maxNum: number, fromTutoria?: string): Exercise {
  const a = rand(1, maxNum);
  const b = rand(1, maxNum - a);
  return {
    id,
    type: 'fichas',
    question: `Juntá las fichas: un grupo de ${a} y un grupo de ${b}. ¿Cuántas hay en total?`,
    correctAnswer: a + b,
    tiles: [a, b],
    fromTutoria,
  };
}

function generateVerdaderoFalso(id: string, maxNum: number, fromTutoria?: string): Exercise {
  const a = rand(1, maxNum);
  const b = rand(0, maxNum - a);
  const correct = a + b;
  const isTrue = Math.random() > 0.5;
  const shown = isTrue ? correct : correct + rand(1, 2);
  return {
    id,
    type: 'verdadero_falso',
    question: `¿Es verdad que ${a} + ${b} = ${shown}?`,
    correctAnswer: isTrue ? 1 : 0,
    options: [0, 1], // 0 = falso, 1 = verdadero
    equation: `${a} + ${b} = ${shown}`,
    fromTutoria,
  };
}

function generateNumeroFaltante(id: string, maxNum: number, fromTutoria?: string): Exercise {
  const total = rand(2, maxNum);
  const a = rand(1, total - 1);
  const b = total - a;
  // Hide one of them
  const hideFirst = Math.random() > 0.5;
  const question = hideFirst
    ? `¿Qué número falta? ? + ${b} = ${total}`
    : `¿Qué número falta? ${a} + ? = ${total}`;
  return {
    id,
    type: 'numero_faltante',
    question,
    correctAnswer: hideFirst ? a : b,
    equation: hideFirst ? `? + ${b} = ${total}` : `${a} + ? = ${total}`,
    fromTutoria,
  };
}

function generateSubitizing(id: string, maxNum: number, fromTutoria?: string): Exercise {
  const count = rand(1, Math.min(maxNum, 5));
  return {
    id,
    type: 'subitizing',
    question: '¿Cuántas fichas ves?',
    correctAnswer: count,
    tiles: [count],
    fromTutoria,
  };
}

/** Generate review exercises from the tutoria's spacedRepetition config */
function generateReviewFromConfig(
  tutoria: TutoriaConfig,
  level: AdaptiveLevel,
  count: number
): Exercise[] {
  const maxNum = getMaxNumber(level);
  const reviews: Exercise[] = [];
  const reviewTypes: ExerciseType[] = ['multiple_choice', 'suma_directa', 'subitizing'];

  for (let i = 0; i < count; i++) {
    const type = reviewTypes[i % reviewTypes.length];
    const reviewTutoriaId =
      tutoria.spacedRepetition.conceptosARepasar[
        i % tutoria.spacedRepetition.conceptosARepasar.length
      ];
    const exercise = generateExercise(
      `review-${tutoria.tutoriaId}-${i}`,
      type,
      maxNum,
      level,
      reviewTutoriaId
    );
    exercise.isReview = true;
    reviews.push(exercise);
  }

  return reviews;
}
