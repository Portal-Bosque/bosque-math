// localStorage wrapper for StudentProgress

import type { DifficultyLevel } from './engine/adaptive';

export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface LessonProgress {
  status: LessonStatus;
  bestScore: number;
  attempts: number;
  lastAttemptDate: string;
  adaptiveLevel: DifficultyLevel;
}

export interface StudentProgress {
  name: string;
  currentLesson: number;
  lessons: Record<string, LessonProgress>;
}

const STORAGE_KEY = 'bosque-math-progress';

function getDefaultProgress(): StudentProgress {
  return {
    name: '',
    currentLesson: 0,
    lessons: {
      '0': { status: 'available', bestScore: 0, attempts: 0, lastAttemptDate: '', adaptiveLevel: 1 },
      '1': { status: 'locked', bestScore: 0, attempts: 0, lastAttemptDate: '', adaptiveLevel: 1 },
      '2': { status: 'locked', bestScore: 0, attempts: 0, lastAttemptDate: '', adaptiveLevel: 1 },
    },
  };
}

export function loadProgress(): StudentProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as StudentProgress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateLessonProgress(
  progress: StudentProgress,
  lessonId: string,
  score: number,
  adaptiveLevel: DifficultyLevel
): StudentProgress {
  const lesson = progress.lessons[lessonId] ?? {
    status: 'available' as LessonStatus,
    bestScore: 0,
    attempts: 0,
    lastAttemptDate: '',
    adaptiveLevel: 1 as DifficultyLevel,
  };

  const updated: StudentProgress = {
    ...progress,
    lessons: {
      ...progress.lessons,
      [lessonId]: {
        ...lesson,
        bestScore: Math.max(lesson.bestScore, score),
        attempts: lesson.attempts + 1,
        lastAttemptDate: new Date().toISOString(),
        adaptiveLevel,
        status: score >= 6 ? 'completed' : 'in-progress',
      },
    },
  };

  // Unlock next lesson if completed
  if (score >= 6) {
    const nextId = String(Number(lessonId) + 1);
    if (updated.lessons[nextId] && updated.lessons[nextId].status === 'locked') {
      updated.lessons[nextId] = { ...updated.lessons[nextId], status: 'available' };
    }
    updated.currentLesson = Math.max(updated.currentLesson, Number(lessonId) + 1);
  }

  return updated;
}

export function setStudentName(progress: StudentProgress, name: string): StudentProgress {
  return { ...progress, name };
}
