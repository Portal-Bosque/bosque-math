'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tile from '@/components/tiles/Tile';
import ResponseButtons from '@/components/tutor/ResponseButtons';

interface SubitizingExerciseProps {
  number: number;
  displayTimeMs?: number;
  options: number[];
  onAnswer: (value: number) => void;
  disabled?: boolean;
}

export default function SubitizingExercise({
  number,
  displayTimeMs = 2000,
  options,
  onAnswer,
  disabled = false,
}: SubitizingExerciseProps) {
  const [phase, setPhase] = useState<'showing' | 'answering'>('showing');

  const startAnswering = useCallback(() => {
    setPhase('answering');
  }, []);

  useEffect(() => {
    setPhase('showing');
    const timer = setTimeout(startAnswering, displayTimeMs);
    return () => clearTimeout(timer);
  }, [number, displayTimeMs, startAnswering]);

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {phase === 'showing' ? (
          <motion.div
            key="tile-display"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-xl text-white/70">¡Mirá bien!</p>
            <Tile value={number} size={120} />
          </motion.div>
        ) : (
          <motion.div
            key="answer-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-2xl text-white font-bold">¿Cuántos puntitos viste?</p>
            <div className="w-full max-w-[320px]">
              <ResponseButtons
                options={options.map((o) => ({ label: String(o), value: o }))}
                onSelect={(v) => onAnswer(v as number)}
                disabled={disabled}
                columns={2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
