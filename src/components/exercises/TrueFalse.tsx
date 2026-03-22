'use client';

import { motion } from 'framer-motion';
import ResponseButtons from '@/components/tutor/ResponseButtons';

interface TrueFalseProps {
  a: number;
  b: number;
  proposedAnswer: number;
  onAnswer: (isTrue: boolean) => void;
  disabled?: boolean;
}

export default function TrueFalse({
  a,
  b,
  proposedAnswer,
  onAnswer,
  disabled = false,
}: TrueFalseProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Equation */}
      <motion.div
        className="bg-white/10 rounded-2xl px-8 py-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <p className="text-4xl font-bold text-white text-center">
          {a} + {b} = {proposedAnswer}
        </p>
      </motion.div>

      <p className="text-xl text-white/80">¿Es verdad o mentira?</p>

      {/* Yes/No buttons */}
      <div className="w-full max-w-[320px]">
        <ResponseButtons
          options={[
            { label: '✅ Verdad', value: 'true' },
            { label: '❌ Mentira', value: 'false' },
          ]}
          onSelect={(v) => onAnswer(v === 'true')}
          disabled={disabled}
          columns={2}
        />
      </div>
    </div>
  );
}
