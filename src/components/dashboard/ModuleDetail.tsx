'use client';

import { motion } from 'framer-motion';
import type { ModuleConfig, TutoriaProgress } from '@/lib/types';

// ---------------------------------------------------------------------------
// ModuleDetail — Expanded view showing all tutorias in a module
// ---------------------------------------------------------------------------

interface TutoriaEntry {
  id: string;
  title: string;
  status: TutoriaProgress['status'];
  bestScore: number;
  stars: number; // 0-3
}

interface ModuleDetailProps {
  module: ModuleConfig;
  tutorias: TutoriaEntry[];
  onSelectTutoria: (tutoriaId: string) => void;
  onBack: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  semilla: '🌱 Semilla',
  brote: '🌿 Brote',
  rama: '🌳 Rama',
};

function StarDisplay({ count }: { count: number }) {
  return (
    <span className="text-lg tracking-wide">
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={i < count ? '' : 'opacity-20'}>
          ⭐
        </span>
      ))}
    </span>
  );
}

export default function ModuleDetail({
  module,
  tutorias,
  onSelectTutoria,
  onBack,
}: ModuleDetailProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white
                     transition-colors min-h-[48px] text-lg"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Volver
        </motion.button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">{module.icon}</span>
            {module.name}
          </h2>
          <p className="text-sm text-white/50">
            {LEVEL_LABELS[module.nivel] ?? module.nivel}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/60 text-base">{module.description}</p>

      {/* Tutoria list */}
      <div className="flex flex-col gap-2">
        {tutorias.map((t, i) => {
          const isLocked = t.status === 'locked';
          const isCompleted = t.status === 'completed';
          const isAvailable = t.status === 'available' || t.status === 'in-progress';

          return (
            <motion.button
              key={t.id}
              onClick={() => isAvailable && onSelectTutoria(t.id)}
              disabled={isLocked}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all
                ${isLocked ? 'bg-white/5 opacity-40 cursor-not-allowed' : ''}
                ${isAvailable ? 'bg-white/10 hover:bg-white/15 cursor-pointer' : ''}
                ${isCompleted ? 'bg-emerald-500/10 hover:bg-emerald-500/15 cursor-pointer' : ''}
              `}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={isLocked ? {} : { x: 4 }}
            >
              {/* Number */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                  ${isCompleted ? 'bg-emerald-500/30 text-emerald-300' : ''}
                  ${isAvailable ? 'bg-white/15 text-white' : ''}
                  ${isLocked ? 'bg-white/5 text-white/30' : ''}
                `}
              >
                {isLocked ? '🔒' : isCompleted ? '✓' : t.id.split('.')[1] ?? i + 1}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className={`text-lg font-medium truncate ${isLocked ? 'text-white/30' : 'text-white'}`}>
                  {t.title}
                </p>
                {t.bestScore > 0 && (
                  <p className="text-sm text-white/40">Mejor: {t.bestScore}%</p>
                )}
              </div>

              {/* Stars */}
              {isCompleted && <StarDisplay count={t.stars} />}

              {/* Arrow for available */}
              {isAvailable && !isCompleted && (
                <span className="text-white/40 text-xl">→</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
