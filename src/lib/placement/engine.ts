// =============================================================================
// Bosque Math v2 — Placement Test Engine
// Binary search style: converge on the right starting module in 7-15 questions
// =============================================================================

import type { PlacementQuestion, PlacementResult } from '../types';
import { PLACEMENT_QUESTIONS } from './questions';
import { getTutoriaIdsForModulo } from '../curriculum/tutorias';

interface PlacementState {
  answeredQuestions: { question: PlacementQuestion; correct: boolean }[];
  currentLow: number;   // lowest possible module
  currentHigh: number;   // highest possible module
  questionsAsked: number;
  correctStreak: number;
  wrongStreak: number;
}

const MIN_QUESTIONS = 7;
const MAX_QUESTIONS = 15;

export class PlacementEngine {
  private state: PlacementState;

  constructor() {
    this.state = {
      answeredQuestions: [],
      currentLow: 1,
      currentHigh: 15,
      questionsAsked: 0,
      correctStreak: 0,
      wrongStreak: 0,
    };
  }

  /** Get the next question based on current state. Returns null if test is done. */
  getNextQuestion(): PlacementQuestion | null {
    if (this.isComplete()) return null;

    // Target the middle of our range
    const targetDifficulty = Math.round(
      (this.state.currentLow + this.state.currentHigh) / 2
    );

    // Find the best unasked question near the target difficulty
    const askedIds = new Set(
      this.state.answeredQuestions.map((a) => a.question.id)
    );

    const available = PLACEMENT_QUESTIONS.filter((q) => !askedIds.has(q.id));
    if (available.length === 0) return null;

    // Sort by distance from target difficulty
    available.sort(
      (a, b) =>
        Math.abs(a.difficulty - targetDifficulty) -
        Math.abs(b.difficulty - targetDifficulty)
    );

    return available[0];
  }

  /** Record an answer and update bounds */
  answer(questionId: string, selectedValue: number): void {
    const question = PLACEMENT_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    const correct = selectedValue === question.correctValue;
    this.state.answeredQuestions.push({ question, correct });
    this.state.questionsAsked++;

    if (correct) {
      this.state.correctStreak++;
      this.state.wrongStreak = 0;
      // They can do at least this level — raise the floor
      this.state.currentLow = Math.max(
        this.state.currentLow,
        question.moduloIfCorrect
      );
    } else {
      this.state.wrongStreak++;
      this.state.correctStreak = 0;
      // They struggle here — lower the ceiling
      this.state.currentHigh = Math.min(
        this.state.currentHigh,
        question.moduloIfWrong
      );
    }

    // Ensure low <= high
    if (this.state.currentLow > this.state.currentHigh) {
      this.state.currentHigh = this.state.currentLow;
    }
  }

  /** Check if we have enough data to converge */
  isComplete(): boolean {
    const { questionsAsked, currentLow, currentHigh } = this.state;

    // Not enough questions yet
    if (questionsAsked < MIN_QUESTIONS) return false;

    // Max reached
    if (questionsAsked >= MAX_QUESTIONS) return true;

    // Converged: range is narrow enough
    if (currentHigh - currentLow <= 1) return true;

    // Strong streak with enough questions → confident
    if (questionsAsked >= 10 && (this.state.correctStreak >= 3 || this.state.wrongStreak >= 3)) {
      return true;
    }

    return false;
  }

  /** Get the placement result */
  getResult(): PlacementResult {
    const startingModulo = this.state.currentLow;

    // Get first tutoria of the starting module
    const tutorias = getTutoriaIdsForModulo(startingModulo);
    const startingTutoria = tutorias[0] ?? `${startingModulo}.1`;

    // Analyze strengths and weaknesses
    const strengths: string[] = [];
    const areasToWork: string[] = [];

    const moduleStrengths: Record<string, boolean[]> = {};
    for (const { question, correct } of this.state.answeredQuestions) {
      const key = `m${question.moduloIfCorrect}`;
      if (!moduleStrengths[key]) moduleStrengths[key] = [];
      moduleStrengths[key].push(correct);
    }

    const moduleNames: Record<string, string> = {
      m1: 'Números hasta 20',
      m2: 'Suma hasta 10',
      m3: 'Resta hasta 10',
      m4: 'Suma y resta hasta 20',
      m7: 'Valor posicional',
      m8: 'Suma y resta hasta 100',
      m9: 'Multiplicación',
      m10: 'División',
      m13: 'Números hasta 1000',
      m14: 'Operaciones hasta 1000',
      m15: 'Tablas completas',
      m16: 'Fracciones',
    };

    for (const [key, results] of Object.entries(moduleStrengths)) {
      const correctCount = results.filter(Boolean).length;
      const name = moduleNames[key] ?? key;
      if (correctCount === results.length) {
        strengths.push(name);
      } else if (correctCount === 0) {
        areasToWork.push(name);
      }
    }

    return {
      startingModulo,
      startingTutoria,
      strengths,
      areasToWork,
    };
  }

  /** Get current progress for UI */
  getProgress(): { questionsAsked: number; maxQuestions: number; estimatedLevel: number } {
    return {
      questionsAsked: this.state.questionsAsked,
      maxQuestions: MAX_QUESTIONS,
      estimatedLevel: Math.round(
        (this.state.currentLow + this.state.currentHigh) / 2
      ),
    };
  }
}
