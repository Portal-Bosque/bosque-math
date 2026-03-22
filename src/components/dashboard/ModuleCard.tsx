'use client';

import { motion } from 'framer-motion';
import type { ModuleConfig } from '@/lib/types';

// ---------------------------------------------------------------------------
// ModuleCard — Shows module status + progress on the dashboard
// ---------------------------------------------------------------------------

interface ModuleCardProps {
  module: ModuleConfig;
  completedTutorias: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  onClick: (moduleId: number) => void;
  index: number;
}

const LEVEL_COLORS: Record<string, string> = {
  semilla: 'bg-emerald-500/20 text-emerald-300',
  brote: 'bg-amber-500/20 text-amber-300',
  rama: 'bg-purple-500/20 text-purple-300',
};

const LEVEL_LABELS: Record<string, string> = {
  semilla: '🌱 Semilla',
  brote: '🌿 Brote',
  rama: '🌳 Rama',
};

export default function ModuleCard({
  module,
  completedTutorias,
  status,
  onClick,
  index,
}: ModuleCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const progress = module.tutoriaCount > 0 ? completedTutorias / module.tutoriaCount : 0;

  return (
    <motion.button
      onClick={() => !isLocked && onClick(module.id)}
      disabled={isLocked}
      className={`
        w-full text-left p-5 rounded-2xl transition-all
        ${isLocked ? 'bg-white/5 opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/15 cursor-pointer'}
        ${isCompleted ? 'ring-2 ring-emerald-500/30' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={isLocked ? {} : { scale: 1.02 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-white/5">
          {isLocked ? '🔒' : module.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white truncate">{module.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${LEVEL_COLORS[module.nivel] ?? ''}`}>
              {LEVEL_LABELS[module.nivel] ?? module.nivel}
            </span>
          </div>

          <p className="text-sm text-white/50 truncate">{module.description}</p>

          {/* Progress bar */}
          {!isLocked && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-500/60'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.6, delay: index * 0.06 + 0.3 }}
                />
              </div>
              <span className="text-xs text-white/40">
                {completedTutorias}/{module.tutoriaCount}
              </span>
            </div>
          )}
        </div>

        {/* Status icon */}
        <div className="flex-shrink-0">
          {isCompleted && <span className="text-2xl">⭐</span>}
          {status === 'in-progress' && (
            <motion.span
              className="text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ▶️
            </motion.span>
          )}
          {status === 'available' && <span className="text-2xl text-white/40">→</span>}
        </div>
      </div>
    </motion.button>
  );
}
