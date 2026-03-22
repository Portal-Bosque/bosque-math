'use client';

import { motion } from 'framer-motion';
import ResponseButtons from '@/components/tutor/ResponseButtons';
import Tile from '@/components/tiles/Tile';

interface MultipleChoiceProps {
  a: number;
  b: number;
  options: number[];
  onAnswer: (value: number) => void;
  disabled?: boolean;
}

export default function MultipleChoice({
  a,
  b,
  options,
  onAnswer,
  disabled = false,
}: MultipleChoiceProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Equation */}
      <div className="flex items-center gap-3">
        <Tile value={a} size={72} showNumber />
        <motion.span className="text-3xl font-bold text-white">+</motion.span>
        <Tile value={b} size={72} showNumber />
        <span className="text-3xl font-bold text-white">=</span>
        <span className="text-3xl font-bold text-amber-300">?</span>
      </div>

      {/* Options */}
      <div className="w-full max-w-[320px]">
        <ResponseButtons
          options={options.map((o) => ({ label: String(o), value: o }))}
          onSelect={(v) => onAnswer(v as number)}
          disabled={disabled}
          columns={2}
        />
      </div>
    </div>
  );
}
