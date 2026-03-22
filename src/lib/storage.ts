// =============================================================================
// Bosque Math v2 — localStorage wrapper
// =============================================================================

import type {
  StudentProgress,
  TutoriaProgress,
  SpacedRepetitionState,
  PlacementResult,
} from './types';

const STORAGE_KEY = 'bosque-math-progress';

function defaultProgress(): StudentProgress {
  return {
    name: '',
    age: 7,
    placementCompleted: false,
    currentModulo: 1,
    currentTutoria: '1.1',
    tutorias: {},
    spacedRepetition: { reviews: [] },
  };
}

export function getProgress(): StudentProgress {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);

    // Migrate v1 data or fix missing fields
    if (!parsed.tutorias || typeof parsed.tutorias !== 'object') {
      parsed.tutorias = {};
    }
    if (!parsed.spacedRepetition || typeof parsed.spacedRepetition !== 'object') {
      parsed.spacedRepetition = { reviews: [] };
    }
    if (typeof parsed.placementCompleted !== 'boolean') {
      parsed.placementCompleted = false;
    }
    if (typeof parsed.age !== 'number') {
      parsed.age = 7;
    }
    if (typeof parsed.currentModulo !== 'number') {
      parsed.currentModulo = 1;
    }
    if (typeof parsed.currentTutoria !== 'string') {
      parsed.currentTutoria = '1.1';
    }

    return parsed as StudentProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateTutoriaProgress(
  tutoriaId: string,
  update: Partial<TutoriaProgress>,
): void {
  const progress = getProgress();
  const existing = progress.tutorias[tutoriaId] ?? {
    status: 'available' as const,
    bestScore: 0,
    attempts: 0,
    lastAttemptDate: '',
    adaptiveLevel: 1 as const,
    masteryScore: 0,
  };
  progress.tutorias[tutoriaId] = { ...existing, ...update };
  saveProgress(progress);
}

export function completePlacement(result: PlacementResult): void {
  const progress = getProgress();
  progress.placementCompleted = true;
  progress.currentModulo = result.startingModulo;
  progress.currentTutoria = result.startingTutoria;
  saveProgress(progress);
}

export function getSpacedRepetitionState(): SpacedRepetitionState {
  return getProgress().spacedRepetition;
}

export function updateSpacedRepetition(state: SpacedRepetitionState): void {
  const progress = getProgress();
  progress.spacedRepetition = state;
  saveProgress(progress);
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
