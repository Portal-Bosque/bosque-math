'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Exercise } from '@/lib/engine/exercise-generator';
import { generateSession } from '@/lib/engine/exercise-generator';
import {
  type AdaptiveState,
  type DifficultyLevel,
  createAdaptiveState,
  recordCorrect,
  recordWrong,
} from '@/lib/engine/adaptive';
import { createAttemptTracker, recordFailedAttempt, type AttemptTracker } from '@/lib/tutor/protocol';
import { getRandomPhrase } from '@/lib/tutor/phrases';
import { scoreSession, type SessionResult } from '@/lib/engine/scoring';
import TutorPanel from '@/components/tutor/TutorPanel';
import StarBar from '@/components/progress/StarBar';
import DirectSum from './DirectSum';
import TileSum from './TileSum';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import MissingNumber from './MissingNumber';
import SubitizingExercise from './SubitizingExercise';

interface ExerciseEngineProps {
  lessonId: number;
  initialLevel?: DifficultyLevel;
  onComplete: (result: SessionResult, finalLevel: DifficultyLevel) => void;
}

export default function ExerciseEngine({
  lessonId,
  initialLevel = 1,
  onComplete,
}: ExerciseEngineProps) {
  const [adaptive, setAdaptive] = useState<AdaptiveState>(() =>
    createAdaptiveState(initialLevel)
  );

  const [exercises] = useState<Exercise[]>(() =>
    generateSession(lessonId, initialLevel)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [tutorMessage, setTutorMessage] = useState(() => getRandomPhrase('transition'));
  const [isAnswered, setIsAnswered] = useState(false);
  const [attemptTracker, setAttemptTracker] = useState<AttemptTracker>(() =>
    createAttemptTracker(exercises[0]?.id ?? '0')
  );
  const [sessionDone, setSessionDone] = useState(false);

  const exercise = exercises[currentIndex] as Exercise | undefined;
  const total = exercises.length;

  const handleCorrectAnswer = useCallback(() => {
    setIsAnswered(true);
    setCorrectCount((c) => c + 1);
    setAdaptive((prev) => recordCorrect(prev));
    setTutorMessage(getRandomPhrase('celebration'));

    // Advance after a short delay
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
        setTutorMessage(getRandomPhrase('transition'));
        setAttemptTracker(createAttemptTracker(exercises[nextIndex].id));
      }
    }, 1500);
  }, [currentIndex, total, correctCount, adaptive.level, exercises, onComplete]);

  const handleWrongAnswer = useCallback(() => {
    setAdaptive((prev) => recordWrong(prev));
    const response = recordFailedAttempt(attemptTracker);
    setAttemptTracker({ ...attemptTracker });
    setTutorMessage(response.message);
  }, [attemptTracker]);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (!exercise || isAnswered) return;
      if (answer === exercise.answer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [exercise, isAnswered, handleCorrectAnswer, handleWrongAnswer]
  );

  const handleTrueFalseAnswer = useCallback(
    (isTrue: boolean) => {
      if (!exercise || isAnswered) return;
      const answer = isTrue ? 1 : 0;
      if (answer === exercise.answer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    },
    [exercise, isAnswered, handleCorrectAnswer, handleWrongAnswer]
  );

  const handleHelpClick = useCallback(() => {
    if (!exercise) return;
    const lessonKey = `hint_lesson${lessonId}` as const;
    const validKeys = ['hint_lesson0', 'hint_lesson1', 'hint_lesson2'] as const;
    if (validKeys.includes(lessonKey as typeof validKeys[number])) {
      setTutorMessage(getRandomPhrase(lessonKey as typeof validKeys[number]));
    } else {
      setTutorMessage(getRandomPhrase('motivation'));
    }
  }, [exercise, lessonId]);

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
                  number={exercise.a}
                  options={exercise.options ?? []}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'direct_sum' && (
                <DirectSum
                  a={exercise.a}
                  b={exercise.b}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'tile_sum' && (
                <TileSum
                  targetSum={exercise.answer}
                  maxTileValue={Math.min(exercise.answer, 10)}
                  onCorrect={handleCorrectAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'multiple_choice' && (
                <MultipleChoice
                  a={exercise.a}
                  b={exercise.b}
                  options={exercise.options ?? []}
                  onAnswer={handleAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'true_false' && (
                <TrueFalse
                  a={exercise.a}
                  b={exercise.b}
                  proposedAnswer={exercise.proposedAnswer ?? exercise.a + exercise.b}
                  onAnswer={handleTrueFalseAnswer}
                  disabled={isAnswered}
                />
              )}
              {exercise.type === 'missing_number' && (
                <MissingNumber
                  a={exercise.a}
                  b={exercise.b}
                  answer={exercise.a + exercise.b}
                  missingPart={exercise.missingPart ?? 'answer'}
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
