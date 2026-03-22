'use client';

import { motion } from 'framer-motion';
import NumberInput from '@/components/tutor/NumberInput';
import Tile from '@/components/tiles/Tile';

interface DirectSumProps {
  a: number;
  b: number;
  onAnswer: (value: number) => void;
  disabled?: boolean;
}

export default function DirectSum({ a, b, onAnswer, disabled = false }: DirectSumProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Visual tiles */}
      <div className="flex items-center gap-4">
        <Tile value={a} size={80} showNumber />
        <motion.span
          className="text-4xl font-bold text-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          +
        </motion.span>
        <Tile value={b} size={80} showNumber />
        <span className="text-4xl font-bold text-white">=</span>
        <span className="text-4xl font-bold text-amber-300">?</span>
      </div>

      {/* Number input */}
      <div className="w-full max-w-[260px]">
        <NumberInput onSubmit={onAnswer} disabled={disabled} maxValue={20} />
      </div>
    </div>
  );
}
