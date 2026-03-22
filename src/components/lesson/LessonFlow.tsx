'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TutoriaConfig, Phase } from '@/lib/types';
import type { SessionResult } from '@/components/exercises/ExerciseEngine';
import type { AdaptiveLevel } from '@/lib/engine/adaptive';
import PhaseIndicator from './PhaseIndicator';
import TutorChat from '@/components/tutor/TutorChat';
import Workspace from '@/components/workspace/Workspace';
import ExerciseEngine from '@/components/exercises/ExerciseEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PhaseType = 'exploracion' | 'guiada' | 'ejercicios';

interface LessonFlowProps {
  tutoria: TutoriaConfig;
  studentName: string;
  studentAge: number;
  initialLevel?: AdaptiveLevel;
  onComplete: (result: SessionResult, finalLevel: AdaptiveLevel) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LessonFlow({
  tutoria,
  studentName,
  studentAge,
  initialLevel = 1,
  onComplete,
}: LessonFlowProps) {
  const phases = tutoria.fases.map((f) => f.tipo);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<PhaseType[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const sessionStartRef = useRef(Date.now());

  const currentPhase = phases[currentPhaseIndex] ?? 'ejercicios';
  const currentPhaseConfig: Phase | undefined = tutoria.fases[currentPhaseIndex];

  // ── Phase transition ──
  const handlePhaseTransition = useCallback(() => {
    setCompletedPhases((prev) => [...prev, currentPhase]);

    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex((i) => i + 1);
    }
  }, [currentPhase, currentPhaseIndex, phases.length]);

  // ── Exercise completion ──
  const handleExerciseComplete = useCallback(
    (result: SessionResult, finalLevel: AdaptiveLevel) => {
      setCompletedPhases((prev) => [...prev, 'ejercicios']);
      setSessionResult(result);
      setSessionComplete(true);
      onComplete(result, finalLevel);
    },
    [onComplete],
  );

  // ── Session timer (internal) ──
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (Date.now() - sessionStartRef.current) / 1000 / 60;
      // Soft warning at 10 min — could trigger tutor to wrap up
      if (elapsed > 10) {
        // Internal tracking only
      }
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  // ── Complete screen ──
  if (sessionComplete && sessionResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
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
        <p className="text-lg text-white/50 text-center max-w-md">{sessionResult.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Phase indicator */}
      <PhaseIndicator currentPhase={currentPhase} completedPhases={completedPhases} />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {/* ── Exploración ── */}
        {currentPhase === 'exploracion' && (
          <motion.div
            key="exploracion"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col lg:flex-row gap-4"
          >
            {/* Workspace with free tiles */}
            <div className="flex-1 min-h-[300px]">
              <Workspace maxTileValue={10} />
            </div>

            {/* Tutor chat */}
            <div className="w-full lg:w-96 bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col max-h-[500px] lg:max-h-none">
              <TutorChat
                tutoriaId={tutoria.tutoriaId}
                phase="exploracion"
                studentName={studentName}
                studentAge={studentAge}
                tutoriaTitle={tutoria.titulo}
                tutoriaConcept={tutoria.concepto}
                phaseInstructions={currentPhaseConfig?.instruccionesTutor}
                onPhaseTransition={handlePhaseTransition}
                initialMessage={`¡Hola ${studentName}! Hoy vamos a explorar ${tutoria.concepto.toLowerCase()}. ¡Jugá con las fichas! 🌿`}
              />
            </div>
          </motion.div>
        )}

        {/* ── Guiada ── */}
        {currentPhase === 'guiada' && (
          <motion.div
            key="guiada"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col lg:flex-row gap-4"
          >
            {/* Workspace with relevant tiles */}
            <div className="flex-1 min-h-[300px]">
              <Workspace maxTileValue={10} />
            </div>

            {/* Tutor chat leading the session */}
            <div className="w-full lg:w-96 bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col max-h-[500px] lg:max-h-none">
              <TutorChat
                tutoriaId={tutoria.tutoriaId}
                phase="guiada"
                studentName={studentName}
                studentAge={studentAge}
                tutoriaTitle={tutoria.titulo}
                tutoriaConcept={tutoria.concepto}
                phaseInstructions={currentPhaseConfig?.instruccionesTutor}
                onPhaseTransition={handlePhaseTransition}
                initialMessage={`Ahora te voy a guiar, ${studentName}. ¡Vamos juntos! 🦉`}
              />
            </div>
          </motion.div>
        )}

        {/* ── Ejercicios ── */}
        {currentPhase === 'ejercicios' && (
          <motion.div
            key="ejercicios"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1"
          >
            <ExerciseEngine
              tutoria={tutoria}
              initialLevel={initialLevel}
              onComplete={handleExerciseComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
