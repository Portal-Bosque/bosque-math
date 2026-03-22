'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonMeta, type LessonPhase } from '@/lib/lessons/index';
import { LESSON_0_INTRO, LESSON_0_EXPLORATION_PROMPTS } from '@/lib/lessons/lesson-0-subitizing';
import { LESSON_1_INTRO, LESSON_1_EXPLORATION_PROMPTS, LESSON_1_EXPLANATION } from '@/lib/lessons/lesson-1-juntamos';
import { LESSON_2_INTRO } from '@/lib/lessons/lesson-2-sumas-hasta-5';
import { loadProgress, saveProgress, updateLessonProgress } from '@/lib/storage';
import type { DifficultyLevel } from '@/lib/engine/adaptive';
import type { SessionResult } from '@/lib/engine/scoring';
import ExerciseEngine from '@/components/exercises/ExerciseEngine';
import TutorPanel from '@/components/tutor/TutorPanel';
import Workspace from '@/components/workspace/Workspace';
import StarBar from '@/components/progress/StarBar';

function getIntroMessages(lessonId: number): string[] {
  switch (lessonId) {
    case 0: return LESSON_0_INTRO;
    case 1: return LESSON_1_INTRO;
    case 2: return LESSON_2_INTRO;
    default: return ['¡Empecemos! 🚀'];
  }
}

function getExplorationPrompts(lessonId: number): string[] {
  switch (lessonId) {
    case 0: return LESSON_0_EXPLORATION_PROMPTS;
    case 1: return LESSON_1_EXPLORATION_PROMPTS;
    default: return [];
  }
}

function getExplanationMessages(lessonId: number): string[] {
  switch (lessonId) {
    case 1: return LESSON_1_EXPLANATION;
    default: return [];
  }
}

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId: lessonSlug } = use(params);
  const router = useRouter();
  const lessonId = parseInt(lessonSlug, 10);
  const lesson = getLessonMeta(lessonId);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [initialLevel, setInitialLevel] = useState<DifficultyLevel>(1);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    const progress = loadProgress();
    const lessonProgress = progress.lessons[lessonSlug];
    if (lessonProgress) {
      setInitialLevel(lessonProgress.adaptiveLevel);
    }
  }, [lessonSlug]);

  const phases = lesson?.phases ?? ['exercises'];
  const currentPhase: LessonPhase = phases[currentPhaseIndex] ?? 'exercises';

  const introMessages = getIntroMessages(lessonId);
  const explorationPrompts = getExplorationPrompts(lessonId);
  const explanationMessages = getExplanationMessages(lessonId);

  const getCurrentMessages = useCallback((): string[] => {
    switch (currentPhase) {
      case 'exploration': return [...introMessages, ...explorationPrompts];
      case 'explanation': return explanationMessages;
      case 'exercises': return [];
      default: return [];
    }
  }, [currentPhase, introMessages, explorationPrompts, explanationMessages]);

  const messages = getCurrentMessages();
  const currentMessage = messages[messageIndex] ?? '';

  const handleNextMessage = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex((i) => i + 1);
    } else {
      // Move to next phase
      if (currentPhaseIndex < phases.length - 1) {
        setCurrentPhaseIndex((i) => i + 1);
        setMessageIndex(0);
      }
    }
  };

  const handleExerciseComplete = (result: SessionResult, finalLevel: DifficultyLevel) => {
    const progress = loadProgress();
    const updated = updateLessonProgress(progress, lessonSlug, result.correct, finalLevel);
    saveProgress(updated);
    setSessionResult(result);
    setSessionComplete(true);
  };

  if (!lesson) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-white text-xl">Lección no encontrada 😕</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-4 py-4 max-w-6xl mx-auto w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white
                     transition-colors min-h-[48px] text-lg"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          🏠 Volver
        </motion.button>
        <h2 className="text-xl font-bold text-white">
          {lesson.icon} {lesson.title}
        </h2>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Exploration / Explanation phases */}
          {currentPhase !== 'exercises' && (
            <motion.div
              key={`phase-${currentPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col lg:flex-row gap-6"
            >
              {/* Workspace (for exploration) */}
              {currentPhase === 'exploration' && (
                <div className="flex-1 flex flex-col">
                  <Workspace maxTileValue={lessonId === 0 ? 10 : 5} />
                </div>
              )}

              {/* Explanation visual */}
              {currentPhase === 'explanation' && (
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    className="text-center p-8 rounded-2xl bg-white/5"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <span className="text-6xl mb-4 block">{lesson.icon}</span>
                    <p className="text-2xl text-white font-bold">{lesson.title}</p>
                  </motion.div>
                </div>
              )}

              {/* Tutor panel */}
              <TutorPanel
                message={currentMessage}
                showHelp={false}
              >
                <motion.button
                  onClick={handleNextMessage}
                  className="w-full px-6 py-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50
                             text-white text-lg font-bold transition-colors min-h-[56px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {messageIndex < messages.length - 1 ? 'Siguiente →' : '¡A practicar! 🚀'}
                </motion.button>
              </TutorPanel>
            </motion.div>
          )}

          {/* Exercises phase */}
          {currentPhase === 'exercises' && !sessionComplete && (
            <motion.div
              key="exercises"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <ExerciseEngine
                lessonId={lessonId}
                initialLevel={initialLevel}
                onComplete={handleExerciseComplete}
              />
            </motion.div>
          )}

          {/* Session complete */}
          {sessionComplete && sessionResult && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-7xl"
              >
                {sessionResult.canAdvance ? '🎉' : '💪'}
              </motion.div>

              <h2 className="text-3xl font-bold text-white text-center">
                {sessionResult.canAdvance ? '¡Increíble!' : '¡Buen trabajo!'}
              </h2>

              <p className="text-xl text-white/70 text-center">
                {sessionResult.correct} de {sessionResult.total} correctas
              </p>

              <StarBar
                stars={[
                  ...Array.from({ length: sessionResult.correct }, () => true),
                  ...Array.from({ length: sessionResult.total - sessionResult.correct }, () => false),
                ]}
                size="lg"
              />

              <p className="text-lg text-white/60 text-center max-w-md">
                {sessionResult.message}
              </p>

              <div className="flex gap-4 mt-4">
                <motion.button
                  onClick={() => router.push('/')}
                  className="px-8 py-4 rounded-xl bg-white/15 hover:bg-white/25
                             text-white text-lg font-bold transition-colors min-h-[56px]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏠 Inicio
                </motion.button>

                {!sessionResult.canAdvance && (
                  <motion.button
                    onClick={() => {
                      setSessionComplete(false);
                      setSessionResult(null);
                    }}
                    className="px-8 py-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50
                               text-white text-lg font-bold transition-colors min-h-[56px]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Intentar de nuevo
                  </motion.button>
                )}

                {sessionResult.canAdvance && lessonId < 2 && (
                  <motion.button
                    onClick={() => router.push(`/lesson/${lessonId + 1}`)}
                    className="px-8 py-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50
                               text-white text-lg font-bold transition-colors min-h-[56px]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Siguiente lección →
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
