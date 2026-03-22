'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTutoria, getNextTutoria } from '@/lib/curriculum/tutorias';
import { getProgress, updateTutoriaProgress } from '@/lib/storage';
import type { AdaptiveLevel } from '@/lib/engine/adaptive';
import LessonFlow from '@/components/lesson/LessonFlow';

interface SessionResult {
  correct: number;
  total: number;
  canAdvance: boolean;
  message: string;
}

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId: tutoriaId } = use(params);
  const router = useRouter();
  const tutoria = getTutoria(tutoriaId);
  const progress = getProgress();

  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<SessionResult | null>(null);

  const handleComplete = (sessionResult: SessionResult, finalLevel: AdaptiveLevel) => {
    updateTutoriaProgress(tutoriaId, {
      status: sessionResult.canAdvance ? 'completed' : 'in-progress',
      bestScore: Math.max(
        sessionResult.correct,
        progress.tutorias[tutoriaId]?.bestScore ?? 0,
      ),
      attempts: (progress.tutorias[tutoriaId]?.attempts ?? 0) + 1,
      lastAttemptDate: new Date().toISOString(),
      adaptiveLevel: finalLevel,
      masteryScore: Math.round((sessionResult.correct / sessionResult.total) * 100),
    });
    setResult(sessionResult);
    setCompleted(true);
  };

  if (!tutoria) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-5xl mb-4">🚧</p>
          <h2 className="text-2xl font-bold text-white mb-2">Tutoría en construcción</h2>
          <p className="text-white/60 mb-6">
            La tutoría {tutoriaId} todavía no está disponible.
          </p>
          <motion.button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-lg font-bold transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 Volver al inicio
          </motion.button>
        </motion.div>
      </main>
    );
  }

  if (completed && result) {
    const nextTutoriaId = getNextTutoria(tutoriaId);
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-7xl"
        >
          {result.canAdvance ? '🎉' : '💪'}
        </motion.div>

        <h2 className="text-3xl font-bold text-white text-center">
          {result.canAdvance ? '¡Increíble!' : '¡Buen trabajo!'}
        </h2>

        <p className="text-xl text-white/70 text-center">
          {result.correct} de {result.total} correctas
        </p>

        <p className="text-lg text-white/60 text-center max-w-md">
          {result.message}
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

          {!result.canAdvance && (
            <motion.button
              onClick={() => {
                setCompleted(false);
                setResult(null);
              }}
              className="px-8 py-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50
                         text-white text-lg font-bold transition-colors min-h-[56px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Intentar de nuevo
            </motion.button>
          )}

          {result.canAdvance && nextTutoriaId && (
            <motion.button
              onClick={() => router.push(`/lesson/${nextTutoriaId}`)}
              className="px-8 py-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50
                         text-white text-lg font-bold transition-colors min-h-[56px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              Siguiente tutoría →
            </motion.button>
          )}
        </div>
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
          {tutoria.titulo}
        </h2>
        <div className="w-24" />
      </div>

      {/* Lesson flow */}
      <LessonFlow
        tutoria={tutoria}
        studentName={progress.name}
        studentAge={progress.age}
        initialLevel={progress.tutorias[tutoriaId]?.adaptiveLevel ?? 1}
        onComplete={handleComplete}
      />
    </main>
  );
}
