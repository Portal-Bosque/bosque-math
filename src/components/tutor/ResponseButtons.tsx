'use client';

import { motion } from 'framer-motion';

interface ResponseButtonsProps {
  options: Array<{ label: string; value: string | number }>;
  onSelect: (value: string | number) => void;
  disabled?: boolean;
  columns?: number;
}

export default function ResponseButtons({
  options,
  onSelect,
  disabled = false,
  columns = 2,
}: ResponseButtonsProps) {
  return (
    <div
      className="grid gap-3 w-full"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((opt, i) => (
        <motion.button
          key={`${opt.value}-${i}`}
          onClick={() => onSelect(opt.value)}
          disabled={disabled}
          className="min-h-[56px] px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25
                     text-white text-xl font-bold transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 select-none"
          whileHover={{ scale: disabled ? 1 : 1.03 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
