// =============================================================================
// Bosque Math v2 — SM-2 Inspired Spaced Repetition
// Intervals: 1d → 3d → 7d → 14d → 30d
// Ease factor adjusts based on performance (0-5 scale)
// =============================================================================

import type { SpacedRepetitionState, SpacedRepetitionReview, Exercise, ExerciseType } from '../types';
import { getSpacedRepetitionState, updateSpacedRepetition } from '../storage';

const INTERVALS = [1, 3, 7, 14, 30]; // days
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

/**
 * Review a tutoria and update its spaced repetition schedule.
 * @param tutoriaId - The tutoria being reviewed
 * @param score - Performance score 0-5 (0=complete fail, 5=perfect)
 */
export function reviewTutoria(tutoriaId: string, score: number): void {
  const state = getSpacedRepetitionState();
  const now = new Date();

  const existingIdx = state.reviews.findIndex((r) => r.tutoriaId === tutoriaId);
  let review: SpacedRepetitionReview;

  if (existingIdx >= 0) {
    review = { ...state.reviews[existingIdx] };
  } else {
    review = {
      tutoriaId,
      nextReviewDate: now.toISOString(),
      interval: 0,
      easeFactor: DEFAULT_EASE_FACTOR,
    };
  }

  // SM-2 algorithm adaptation
  if (score >= 3) {
    // Correct enough — advance interval
    const currentIntervalIdx = INTERVALS.indexOf(review.interval);
    if (currentIntervalIdx < INTERVALS.length - 1) {
      review.interval = INTERVALS[currentIntervalIdx + 1] ?? INTERVALS[INTERVALS.length - 1];
    } else {
      // Beyond our predefined intervals — use ease factor
      review.interval = Math.round(review.interval * review.easeFactor);
    }
  } else {
    // Failed — reset to first interval
    review.interval = INTERVALS[0];
  }

  // Update ease factor based on score
  // EF' = EF + (0.1 - (5 - score) × (0.08 + (5 - score) × 0.02))
  const delta = 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02);
  review.easeFactor = Math.max(MIN_EASE_FACTOR, review.easeFactor + delta);

  // Set next review date
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + review.interval);
  review.nextReviewDate = nextDate.toISOString();

  // Update state
  if (existingIdx >= 0) {
    state.reviews[existingIdx] = review;
  } else {
    state.reviews.push(review);
  }

  updateSpacedRepetition(state);
}

/** Get all tutorias that are due for review (nextReviewDate <= now) */
export function getDueReviews(): SpacedRepetitionReview[] {
  const state = getSpacedRepetitionState();
  const now = new Date().toISOString();

  return state.reviews.filter((r) => r.nextReviewDate <= now);
}

/**
 * Generate review exercises for a specific tutoria.
 * These are simpler exercises that test retention.
 */
export function generateReviewExercises(
  tutoriaId: string,
  count: number
): Exercise[] {
  const exercises: Exercise[] = [];
  const types: ExerciseType[] = ['multiple_choice', 'suma_directa', 'subitizing'];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    // Generate simple review exercises (level 1-2 range)
    const maxNum = 5;
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * (maxNum - a)) + 1;

    const exercise: Exercise = {
      id: `sr-${tutoriaId}-${i}`,
      type,
      question:
        type === 'subitizing'
          ? '¿Cuántas fichas ves?'
          : `¿Cuánto es ${a} + ${b}?`,
      correctAnswer: type === 'subitizing' ? a : a + b,
      isReview: true,
      fromTutoria: tutoriaId,
    };

    if (type === 'multiple_choice') {
      const correct = a + b;
      exercise.options = [
        Math.max(0, correct - 1),
        correct,
        correct + 1,
      ].sort(() => Math.random() - 0.5);
    }

    if (type === 'subitizing') {
      exercise.tiles = [a];
    }

    exercises.push(exercise);
  }

  return exercises;
}

/** Convert a mastery score (0-100) to SM-2 score (0-5) */
export function masteryToSM2Score(mastery: number): number {
  if (mastery >= 90) return 5;
  if (mastery >= 75) return 4;
  if (mastery >= 60) return 3;
  if (mastery >= 40) return 2;
  if (mastery >= 20) return 1;
  return 0;
}
