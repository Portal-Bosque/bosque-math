'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface NumberInputProps {
  maxValue?: number;
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export default function NumberInput({ maxValue = 20, onSubmit, disabled = false }: NumberInputProps) {
  const [value, setValue] = useState<string>('');

  const handleDigit = (digit: number) => {
    if (disabled) return;
    const newVal = value + String(digit);
    const num = parseInt(newVal, 10);
    if (num <= maxValue) {
      setValue(newVal);
    }
  };

  const handleClear = () => {
    setValue('');
  };

  const handleSubmit = () => {
    if (value === '' || disabled) return;
    onSubmit(parseInt(value, 10));
    setValue('');
  };

  // Show digits 0-9 + clear + submit
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Display */}
      <div className="w-full bg-white/10 rounded-xl px-4 py-3 text-center min-h-[56px] flex items-center justify-center">
        <span className="text-3xl font-bold text-white">
          {value || '?'}
        </span>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
        {digits.map((d) => (
          <motion.button
            key={d}
            onClick={() => handleDigit(d)}
            disabled={disabled}
            className="h-14 min-w-[60px] rounded-xl bg-white/15 hover:bg-white/25 
                       text-white text-2xl font-bold transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed
                       active:scale-95"
            whileTap={{ scale: 0.92 }}
          >
            {d}
          </motion.button>
        ))}

        {/* Clear */}
        <motion.button
          onClick={handleClear}
          disabled={disabled}
          className="h-14 rounded-xl bg-red-500/30 hover:bg-red-500/50 
                     text-white text-lg font-bold transition-colors
                     disabled:opacity-40"
          whileTap={{ scale: 0.92 }}
        >
          ✕
        </motion.button>

        {/* Submit */}
        <motion.button
          onClick={handleSubmit}
          disabled={disabled || value === ''}
          className="h-14 col-span-2 rounded-xl bg-emerald-500/40 hover:bg-emerald-500/60 
                     text-white text-lg font-bold transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.92 }}
        >
          ¡Listo! ✓
        </motion.button>
      </div>
    </div>
  );
}
