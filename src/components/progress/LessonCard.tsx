'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LessonMeta } from '@/lib/lessons/index';
import type { LessonStatus } from '@/lib/storage';

interface LessonCardProps {
  lesson: LessonMeta;
  status: LessonStatus;
  bestScore: number;
  index: number;
}

export default function LessonCard({ lesson, status, bestScore, index }: LessonCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {isLocked ? (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
          <span className="text-3xl">🔒</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white/50">{lesson.title}</h3>
            <p className="text-sm text-white/30">{lesson.description}</p>
          </div>
        </div>
      ) : (
        <Link href={`/lesson/${lesson.slug}`}>
          <motion.div
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors cursor-pointer
              ${isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl">{lesson.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
              <p className="text-sm text-white/60">{lesson.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {isCompleted && (
                <span className="text-sm text-emerald-400 font-medium">✅ Completada</span>
              )}
              {bestScore > 0 && (
                <span className="text-sm text-white/50">{bestScore}/8 🌟</span>
              )}
              {!isCompleted && status === 'available' && (
                <span className="text-sm text-amber-300 font-medium">¡Empezar!</span>
              )}
              {status === 'in-progress' && (
                <span className="text-sm text-blue-300 font-medium">Continuar →</span>
              )}
            </div>
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}
