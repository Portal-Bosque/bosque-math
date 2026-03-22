'use client';

import { motion } from 'framer-motion';
import NumberInput from '@/components/tutor/NumberInput';

interface MissingNumberProps {
  a: number;
  b: number;
  answer: number;
  missingPart: 'a' | 'b' | 'answer';
  onAnswer: (value: number) => void;
  disabled?: boolean;
}

export default function MissingNumber({
  a,
  b,
  answer,
  missingPart,
  onAnswer,
  disabled = false,
}: MissingNumberProps) {
  const total = a + b;
  
  const renderPart = (part: 'a' | 'b' | 'answer') => {
    if (part === missingPart) {
      return (
        <motion.span
          className="inline-flex items-center justify-center w-16 h-16 rounded-xl 
                     bg-amber-500/30 border-2 border-amber-400 text-amber-300 text-3xl font-bold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ?
        </motion.span>
      );
    }
    const value = part === 'a' ? a : part === 'b' ? b : total;
    return (
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl
                       bg-white/15 text-white text-3xl font-bold">
        {value}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Equation with missing part */}
      <div className="flex items-center gap-3">
        {renderPart('a')}
        <span className="text-3xl font-bold text-white">+</span>
        {renderPart('b')}
        <span className="text-3xl font-bold text-white">=</span>
        {renderPart('answer')}
      </div>

      {/* Number input */}
      <div className="w-full max-w-[260px]">
        <NumberInput
          onSubmit={onAnswer}
          disabled={disabled}
          maxValue={20}
        />
      </div>
    </div>
  );
}
