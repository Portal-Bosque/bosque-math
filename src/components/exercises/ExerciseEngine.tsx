'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Exercise, TutoriaConfig } from '@/lib/types';
import { generateSession } from '@/lib/engine/exercise-generator';
import {
  type AdaptiveState,
  type AdaptiveLevel,
  createAdaptiveState,
  recordResult,
  getAccuracy,
} from '@/lib/engine/adaptive';
import TutorPanel from '@/components/tutor/TutorPanel';
import StarBar from '@/components/progress/StarBar';
import DirectSum from './DirectSum';
import TileSum from './TileSum';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import MissingNumber from './MissingNumber';
import SubitizingExercise from './SubitizingExercise';

// ---------------------------------------------------------------------------
// Session result (local to exercises)
// ---------------------------------------------------------------------------

export interface SessionResult {
  correct: number;
  total: number;
  canAdvance: boolean;
  message: string;
}

function scoreSession(correct: number, total: number): SessionResult {
  const pct = total > 0 ? correct / total : 0;
  const canAdvance = pct >= 0.7;

  let message: string;
  if (pct >= 0.9) message = '¡Espectacular! Dominás esto completamente. 🌟';
  else if (pct >= 0.7) message = '¡Muy bien! Ya podés avanzar a lo siguiente. 🎉';
  else if (pct >= 0.5) message = '¡Vas bien! Con un poco más de práctica lo vas a dominar. 💪';
  else message = '¡Seguí practicando! Cada intento te hace más fuerte. 🌱';

  return { correct, total, canAdvance, message };
}

// ---------------------------------------------------------------------------
// Motivational phrases
// ---------------------------------------------------------------------------

const CELEBRATION_PHRASES = [
  '¡Muy bien! 🌟',
  '¡Excelente! ⭐',
  '¡Genial! 🎉',
  '¡Así se hace! 💪',
  '¡Perfecto! 🌿',
  '¡Sos un crack! 🚀',
];

const ENCOURAGEMENT_PHRASES = [
  '¡Casi! Probá de nuevo 💪',
  'Pensalo tranqui... 🤔',
  '¡No te rindas! 🌱',
  'Fijate bien los números... 👀',
];

const TRANSITION_PHRASES = [
  '¡Vamos con el siguiente! 🚀',
  '¿Listo? ¡Acá va otro! 🦉',
  '¡Dale que va! 💫',
];

function randomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ExerciseEngineProps {
  tutoria: TutoriaConfig;
  initialLevel?: AdaptiveLevel;
  onComplete: (result: SessionResult, finalLevel: AdaptiveLevel) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExerciseEngine({
  tutoria,
  initialLevel = 1,
  onComplete,
}: ExerciseEngineProps) {
  const [adaptive, setAdaptive] = useState<AdaptiveState>(() =>
    createAdaptiveState(initialLevel),
  );

  const [exercises] = useState<Exercise[]>(() =>
    generateSession(tutoria, initialLevel),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [tutorMessage, setTutorMessage] = useState(() => randomPhrase(TRANSITION_PHRASES));
  const [isAnswered, setIsAnswered] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const exercise = exercises[currentIndex] as Exercise | undefined;
  const total = exercises.length;

  const handleCorrectAnswer = useCallback(() => {
    setIsAnswered(true);
    setCorrectCount((c) => c + 1);
    setAdaptive((prev) => recordResult(prev, true));
    setTutorMessage(randomPhrase(CELEBRATION_PHRASES));

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= total) {
        const result = scoreSession(correctCount + 1, total);
        setSessionDone(true);
        setTutorMessage(result.message);
        onComplete(result, adaptive.level);
      } else {
        setCurrentIndex(nextIndex);
        setIsAnswered(false);
        setFailedAttempts(0);
        setTutorMessage(randomPhrase(TRANSITION_PHRASES));
      }
    }, 1500);
  }, [currentIndex, total, correctCount, adaptive.level, onComplete]);

  const handleWrongAnswer = useCallback(() => {
    setAdaptive((prev) => recordResult(prev, false));
    setFailedAttempts((f) => f + 1);
    setTutorMessage(randomPhrase(ENCOURAGEMENT_PHRASES));
  }, []);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (!exercise || isAnswered) return;
      if (answer === exercise.correctAnswer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [exercise, isAnswered, handleCorrectAnswer, handleWrongAnswer],
  );

  const handleTrueFalseAnswer = useCallback(
    (isTrue: boolean) => {
      if (!exercise || isAnswered) return;
      const answer = isTrue ? 1 : 0;
      if (answer === exercise.correctAnswer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [exercise, isAnswered, handleCorrectAnswer, handleWrongAnswer],
  );

  const handleHelpClick = useCallback(() => {
    if (!exercise) return;
    setTutorMessage('Fijate en los números y contá despacio 🦉');
  }, [exercise]);

  const stars = useMemo(() => {
    const filled = Array.from({ length: correctCount }, () => true);
    const empty = Array.from({ length: total - correctCount }, () => false);
    return [...filled, ...empty];
  }, [correctCount, total]);

  if (sessionDone) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-white">¡Sesión completa!</h2>
          <p className="text-xl text-white/70">
            {correctCount} de {total} correctas
          </p>
          <StarBar stars={stars} />
        </div>
        <TutorPanel message={tutorMessage} showHelp={false} />
      </div>
    );
  }

  if (!exercise) return null;

  // Parse numbers from the exercise for v1-style components
  const nums = parseExerciseNumbers(exercise);

  return (
    <div className="flex flex-col lg:flex-row gap-6 flex-1">
      {/* Main exercise area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-lg">
            Ejercicio {currentIndex + 1} de {total}
          </span>
          <StarBar stars={stars} size="sm" />
        </div>

        {/* Exercise content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {exercise.type === 'subitizing' && (
                <SubitizingExercise
                  number={exercise.tiles?.[0] ?? exercise.correctAnswer}
                  options={exercise.options ?? []}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'suma_directa' && (
                <DirectSum
                  a={nums.a}
                  b={nums.b}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'fichas' && (
                <TileSum
                  targetSum={exercise.correctAnswer}
                  maxTileValue={Math.min(exercise.correctAnswer, 10)}
                  onCorrect={handleCorrectAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'multiple_choice' && (
                <MultipleChoice
                  a={nums.a}
                  b={nums.b}
                  options={exercise.options ?? []}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'verdadero_falso' && (
                <TrueFalse
                  a={nums.a}
                  b={nums.b}
                  proposedAnswer={parseProposedAnswer(exercise)}
                  onAnswer={handleTrueFalseAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'numero_faltante' && (
                <MissingNumber
                  a={nums.a}
                  b={nums.b}
                  answer={nums.a + nums.b}
                  missingPart={detectMissingPart(exercise)}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tutor panel */}
      <TutorPanel
        message={tutorMessage}
        onHelpClick={handleHelpClick}
        showHelp={!isAnswered}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers to extract a/b from v2 Exercise for v1-style sub-components
// ---------------------------------------------------------------------------

function parseExerciseNumbers(exercise: Exercise): { a: number; b: number } {
  // Try to parse from equation like "3 + 2" or "? + 2 = 5"
  if (exercise.equation) {
    // Handle "a + b" pattern
    const sumMatch = exercise.equation.match(/^(\d+)\s*\+\s*(\d+)$/);
    if (sumMatch) {
      return { a: parseInt(sumMatch[1], 10), b: parseInt(sumMatch[2], 10) };
    }

    // Handle "a + b = c" or verdadero_falso pattern
    const eqMatch = exercise.equation.match(/^(\d+)\s*\+\s*(\d+)\s*=\s*(\d+)$/);
    if (eqMatch) {
      return { a: parseInt(eqMatch[1], 10), b: parseInt(eqMatch[2], 10) };
    }

    // Handle "? + b = c" pattern
    const missingFirst = exercise.equation.match(/^\?\s*\+\s*(\d+)\s*=\s*(\d+)$/);
    if (missingFirst) {
      const b = parseInt(missingFirst[1], 10);
      const total = parseInt(missingFirst[2], 10);
      return { a: total - b, b };
    }

    // Handle "a + ? = c" pattern
    const missingSecond = exercise.equation.match(/^(\d+)\s*\+\s*\?\s*=\s*(\d+)$/);
    if (missingSecond) {
      const a = parseInt(missingSecond[1], 10);
      const total = parseInt(missingSecond[2], 10);
      return { a, b: total - a };
    }
  }

  // Fallback: try tiles
  if (exercise.tiles && exercise.tiles.length >= 2) {
    return { a: exercise.tiles[0], b: exercise.tiles[1] };
  }

  return { a: exercise.correctAnswer, b: 0 };
}

function parseProposedAnswer(exercise: Exercise): number {
  if (exercise.equation) {
    const match = exercise.equation.match(/=\s*(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }
  return exercise.correctAnswer;
}

function detectMissingPart(exercise: Exercise): 'a' | 'b' | 'answer' {
  if (exercise.equation) {
    if (exercise.equation.startsWith('?')) return 'a';
    if (exercise.equation.includes('+ ?')) return 'b';
  }
  return 'answer';
}
