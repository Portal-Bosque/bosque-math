'use client';

import { motion } from 'framer-motion';

type PhaseType = 'exploracion' | 'guiada' | 'ejercicios';

interface PhaseIndicatorProps {
  currentPhase: PhaseType;
  completedPhases: PhaseType[];
}

const PHASES: { key: PhaseType; label: string; icon: string }[] = [
  { key: 'exploracion', label: 'Exploración', icon: '🔍' },
  { key: 'guiada', label: 'Guiada', icon: '🦉' },
  { key: 'ejercicios', label: 'Ejercicios', icon: '✏️' },
];

export default function PhaseIndicator({ currentPhase, completedPhases }: PhaseIndicatorProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {PHASES.map((p, i) => {
        const isCompleted = completedPhases.includes(p.key);
        const isCurrent = currentPhase === p.key;

        return (
          <div key={p.key} className="flex items-center gap-2">
            {/* Circle */}
            <motion.div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                transition-colors duration-300
                ${isCurrent ? 'bg-emerald-500/50 text-white ring-2 ring-emerald-400' : ''}
                ${isCompleted ? 'bg-emerald-600/40 text-white' : ''}
                ${!isCurrent && !isCompleted ? 'bg-white/10 text-white/40' : ''}
              `}
              animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isCompleted ? '✓' : p.icon}
            </motion.div>

            {/* Label (only on larger screens) */}
            <span
              className={`hidden sm:inline text-sm ${
                isCurrent ? 'text-white font-bold' : isCompleted ? 'text-white/60' : 'text-white/30'
              }`}
            >
              {p.label}
            </span>

            {/* Connector line */}
            {i < PHASES.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  isCompleted ? 'bg-emerald-500/50' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
