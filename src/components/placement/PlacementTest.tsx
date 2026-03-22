'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlacementResult, PlacementQuestion } from '@/lib/types';

// ---------------------------------------------------------------------------
// 15 adaptive placement questions covering modules 1-10
// ---------------------------------------------------------------------------

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Module 1 — Counting / Subitizing
  {
    id: 'p1',
    question: '¿Cuántos puntos ves? ●●●',
    options: [
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
    ],
    correctValue: 3,
    moduloIfCorrect: 2,
    moduloIfWrong: 1,
    difficulty: 1,
  },
  {
    id: 'p2',
    question: '¿Cuántos hay? ●●●●●●',
    options: [
      { text: '5', value: 5 },
      { text: '6', value: 6 },
      { text: '7', value: 7 },
    ],
    correctValue: 6,
    moduloIfCorrect: 2,
    moduloIfWrong: 1,
    difficulty: 1,
  },
  // Module 2 — Addition up to 10
  {
    id: 'p3',
    question: '¿Cuánto es 2 + 3?',
    options: [
      { text: '4', value: 4 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
    ],
    correctValue: 5,
    moduloIfCorrect: 3,
    moduloIfWrong: 2,
    difficulty: 2,
  },
  {
    id: 'p4',
    question: '¿Cuánto es 4 + 5?',
    options: [
      { text: '8', value: 8 },
      { text: '9', value: 9 },
      { text: '10', value: 10 },
    ],
    correctValue: 9,
    moduloIfCorrect: 3,
    moduloIfWrong: 2,
    difficulty: 2,
  },
  // Module 3 — Subtraction up to 10
  {
    id: 'p5',
    question: '¿Cuánto es 7 - 3?',
    options: [
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
    correctValue: 4,
    moduloIfCorrect: 4,
    moduloIfWrong: 3,
    difficulty: 3,
  },
  {
    id: 'p6',
    question: '¿Cuánto es 10 - 6?',
    options: [
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
    correctValue: 4,
    moduloIfCorrect: 4,
    moduloIfWrong: 3,
    difficulty: 3,
  },
  // Module 4 — Add/Sub up to 20
  {
    id: 'p7',
    question: '¿Cuánto es 8 + 7?',
    options: [
      { text: '14', value: 14 },
      { text: '15', value: 15 },
      { text: '16', value: 16 },
    ],
    correctValue: 15,
    moduloIfCorrect: 7,
    moduloIfWrong: 4,
    difficulty: 4,
  },
  {
    id: 'p8',
    question: '¿Cuánto es 16 - 9?',
    options: [
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '8', value: 8 },
    ],
    correctValue: 7,
    moduloIfCorrect: 7,
    moduloIfWrong: 4,
    difficulty: 4,
  },
  // Module 7 — Place value to 100
  {
    id: 'p9',
    question: '¿Cuántas decenas tiene el número 47?',
    options: [
      { text: '4', value: 4 },
      { text: '7', value: 7 },
      { text: '47', value: 47 },
    ],
    correctValue: 4,
    moduloIfCorrect: 8,
    moduloIfWrong: 7,
    difficulty: 5,
  },
  {
    id: 'p10',
    question: '¿Qué número es 6 decenas y 3 unidades?',
    options: [
      { text: '36', value: 36 },
      { text: '63', value: 63 },
      { text: '93', value: 93 },
    ],
    correctValue: 63,
    moduloIfCorrect: 8,
    moduloIfWrong: 7,
    difficulty: 5,
  },
  // Module 8 — Add/Sub to 100
  {
    id: 'p11',
    question: '¿Cuánto es 34 + 25?',
    options: [
      { text: '57', value: 57 },
      { text: '59', value: 59 },
      { text: '69', value: 69 },
    ],
    correctValue: 59,
    moduloIfCorrect: 9,
    moduloIfWrong: 8,
    difficulty: 6,
  },
  {
    id: 'p12',
    question: '¿Cuánto es 73 - 28?',
    options: [
      { text: '45', value: 45 },
      { text: '55', value: 55 },
      { text: '35', value: 35 },
    ],
    correctValue: 45,
    moduloIfCorrect: 9,
    moduloIfWrong: 8,
    difficulty: 6,
  },
  // Module 9 — Multiplication basics
  {
    id: 'p13',
    question: '¿Cuánto es 3 × 4?',
    options: [
      { text: '7', value: 7 },
      { text: '12', value: 12 },
      { text: '14', value: 14 },
    ],
    correctValue: 12,
    moduloIfCorrect: 10,
    moduloIfWrong: 9,
    difficulty: 7,
  },
  // Module 10 — Division basics
  {
    id: 'p14',
    question: '¿Cuánto es 15 ÷ 3?',
    options: [
      { text: '3', value: 3 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
    ],
    correctValue: 5,
    moduloIfCorrect: 11,
    moduloIfWrong: 10,
    difficulty: 8,
  },
  {
    id: 'p15',
    question: '¿Cuánto es 24 ÷ 6?',
    options: [
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '6', value: 6 },
    ],
    correctValue: 4,
    moduloIfCorrect: 11,
    moduloIfWrong: 10,
    difficulty: 8,
  },
];

// ---------------------------------------------------------------------------
// Adaptive engine: binary-search-like through difficulties
// ---------------------------------------------------------------------------

function getNextQuestionIndex(
  answered: Map<string, boolean>,
  questions: PlacementQuestion[],
  lastCorrect: boolean | null,
  lastDifficulty: number,
): number | null {
  const unanswered = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !answered.has(q.id));

  if (unanswered.length === 0) return null;

  // Adaptive: if last was correct, try harder; if wrong, try easier
  let targetDifficulty = lastDifficulty;
  if (lastCorrect === true) targetDifficulty = Math.min(lastDifficulty + 1, 8);
  else if (lastCorrect === false) targetDifficulty = Math.max(lastDifficulty - 1, 1);

  // Find closest unanswered question to target difficulty
  unanswered.sort(
    (a, b) =>
      Math.abs(a.q.difficulty - targetDifficulty) - Math.abs(b.q.difficulty - targetDifficulty),
  );

  return unanswered[0].i;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface PlacementTestProps {
  onComplete: (result: PlacementResult) => void;
  studentName: string;
}

export default function PlacementTest({ onComplete, studentName }: PlacementTestProps) {
  const [phase, setPhase] = useState<'intro' | 'testing' | 'result'>('intro');
  const [answered, setAnswered] = useState<Map<string, boolean>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastDifficulty, setLastDifficulty] = useState(1);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [highestCorrectModule, setHighestCorrectModule] = useState(1);
  const [correctModules, setCorrectModules] = useState<Set<number>>(new Set());
  const [wrongModules, setWrongModules] = useState<Set<number>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const maxQuestions = 8; // Ask ~8 questions via adaptive branching

  const currentQuestion = PLACEMENT_QUESTIONS[currentIndex];
  const progress = Math.min(questionsAsked / maxQuestions, 1);

  const handleStartTest = useCallback(() => {
    setPhase('testing');
  }, []);

  const handleAnswer = useCallback(
    (value: number) => {
      if (showFeedback) return;
      const q = PLACEMENT_QUESTIONS[currentIndex];
      const isCorrect = value === q.correctValue;

      setSelectedAnswer(value);
      setShowFeedback(true);
      setLastCorrect(isCorrect);
      setLastDifficulty(q.difficulty);

      const newAnswered = new Map(answered);
      newAnswered.set(q.id, isCorrect);
      setAnswered(newAnswered);

      if (isCorrect) {
        setHighestCorrectModule((prev) => Math.max(prev, q.moduloIfCorrect));
        setCorrectModules((prev) => new Set([...prev, q.moduloIfCorrect]));
      } else {
        setWrongModules((prev) => new Set([...prev, q.moduloIfWrong]));
      }

      const newCount = questionsAsked + 1;
      setQuestionsAsked(newCount);

      // Wait, then advance
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowFeedback(false);

        if (newCount >= maxQuestions) {
          finishTest(isCorrect ? Math.max(highestCorrectModule, q.moduloIfCorrect) : highestCorrectModule, 
            new Set([...correctModules, ...(isCorrect ? [q.moduloIfCorrect] : [])]),
            new Set([...wrongModules, ...(!isCorrect ? [q.moduloIfWrong] : [])]),
          );
          return;
        }

        const nextIdx = getNextQuestionIndex(newAnswered, PLACEMENT_QUESTIONS, isCorrect, q.difficulty);
        if (nextIdx === null) {
          finishTest(
            isCorrect ? Math.max(highestCorrectModule, q.moduloIfCorrect) : highestCorrectModule,
            new Set([...correctModules, ...(isCorrect ? [q.moduloIfCorrect] : [])]),
            new Set([...wrongModules, ...(!isCorrect ? [q.moduloIfWrong] : [])]),
          );
        } else {
          setCurrentIndex(nextIdx);
        }
      }, 1200);
    },
    [currentIndex, answered, questionsAsked, showFeedback, highestCorrectModule, correctModules, wrongModules],
  );

  const finishTest = useCallback(
    (bestModule: number, correct: Set<number>, wrong: Set<number>) => {
      const moduleNames: Record<number, string> = {
        1: 'Conteo',
        2: 'Suma hasta 10',
        3: 'Resta hasta 10',
        4: 'Suma/Resta hasta 20',
        7: 'Valor posicional',
        8: 'Suma/Resta hasta 100',
        9: 'Multiplicación',
        10: 'División',
        11: 'Avanzado',
      };

      const strengths = [...correct].map((m) => moduleNames[m] ?? `Módulo ${m}`);
      const areasToWork = [...wrong].map((m) => moduleNames[m] ?? `Módulo ${m}`);

      // Start from the wrong module or module 1
      const startModule = wrong.size > 0 ? Math.min(...wrong) : bestModule;

      const result: PlacementResult = {
        startingModulo: startModule,
        startingTutoria: `${startModule}.1`,
        strengths,
        areasToWork,
      };

      setPhase('result');
      setTimeout(() => onComplete(result), 3000);
    },
    [onComplete],
  );

  const resultMessage = useMemo(() => {
    if (highestCorrectModule <= 2) return '¡Vamos a empezar por los números y la suma! 🌱';
    if (highestCorrectModule <= 4) return '¡Ya sabés sumar y restar! Vamos a seguir avanzando. 🌿';
    if (highestCorrectModule <= 8) return '¡Conocés bien los números grandes! Sigamos desde ahí. 💪';
    return '¡Sabés un montón! Vamos con multiplicación y división. 🚀';
  }, [highestCorrectModule]);

  // ── Intro screen ──
  if (phase === 'intro') {
    return (
      <motion.div
        className="flex-1 flex flex-col items-center justify-center gap-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-7xl"
          animate={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        >
          🦉
        </motion.div>
        <h1 className="text-3xl font-bold text-white text-center">
          ¡Hola{studentName ? `, ${studentName}` : ''}!
        </h1>
        <p className="text-xl text-white/70 text-center max-w-md">
          Quiero conocerte mejor. Voy a hacerte unas preguntas para saber por dónde empezar. ¡No te
          preocupes, no hay respuestas &quot;malas&quot;! 🌿
        </p>
        <motion.button
          onClick={handleStartTest}
          className="px-10 py-5 rounded-2xl bg-emerald-500/40 hover:bg-emerald-500/60 
                     text-white text-2xl font-bold transition-colors min-h-[64px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ¡Dale, empecemos! 🚀
        </motion.button>
      </motion.div>
    );
  }

  // ── Result screen ──
  if (phase === 'result') {
    return (
      <motion.div
        className="flex-1 flex flex-col items-center justify-center gap-6 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-7xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          🎉
        </motion.div>
        <h2 className="text-3xl font-bold text-white text-center">¡Ya te conozco!</h2>
        <p className="text-xl text-white/70 text-center max-w-md">{resultMessage}</p>
        <motion.div
          className="w-16 h-1 bg-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>
    );
  }

  // ── Testing screen ──
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center gap-8 px-4 max-w-lg mx-auto w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-sm text-white/40 mt-1 text-center">
          Pregunta {questionsAsked + 1} de ~{maxQuestions}
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🦉</span>
          </div>

          <h2 className="text-2xl font-bold text-white text-center">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3 w-full">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt.value;
              const isCorrect = opt.value === currentQuestion.correctValue;
              let btnClass =
                'w-full min-h-[64px] px-6 py-4 rounded-2xl text-2xl font-bold transition-all';

              if (showFeedback && isSelected && isCorrect) {
                btnClass += ' bg-emerald-500/50 text-white scale-105';
              } else if (showFeedback && isSelected && !isCorrect) {
                btnClass += ' bg-amber-500/40 text-white';
              } else if (showFeedback) {
                btnClass += ' bg-white/5 text-white/30';
              } else {
                btnClass += ' bg-white/15 hover:bg-white/25 text-white';
              }

              return (
                <motion.button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  disabled={showFeedback}
                  className={btnClass}
                  whileHover={showFeedback ? {} : { scale: 1.03 }}
                  whileTap={showFeedback ? {} : { scale: 0.95 }}
                >
                  {opt.text}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-white/70"
            >
              {lastCorrect ? '¡Muy bien! 🌟' : '¡Buen intento! 💪'}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
