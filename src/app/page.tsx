'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LESSONS } from '@/lib/lessons/index';
import { loadProgress, saveProgress, setStudentName } from '@/lib/storage';
import type { StudentProgress } from '@/lib/storage';
import LessonCard from '@/components/progress/LessonCard';

export default function DashboardPage() {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    if (!p.name) {
      setShowNameInput(true);
    }
  }, []);

  const handleSetName = () => {
    if (!nameInput.trim() || !progress) return;
    const updated = setStudentName(progress, nameInput.trim());
    saveProgress(updated);
    setProgress(updated);
    setShowNameInput(false);
  };

  if (!progress) return null;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          🌲 Bosque Math
        </h1>
        {progress.name && (
          <p className="text-xl text-white/70">
            ¡Hola, {progress.name}! 🦉
          </p>
        )}
      </motion.div>

      {/* Name input for first visit */}
      {showNameInput && (
        <motion.div
          className="w-full max-w-md mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🦉</span>
            <p className="text-lg text-white">
              ¡Hola! Soy Bosquito. ¿Cómo te llamás?
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              placeholder="Tu nombre..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/15 text-white text-xl
                         placeholder-white/40 border border-white/20 focus:border-emerald-400
                         focus:outline-none transition-colors"
              autoFocus
            />
            <motion.button
              onClick={handleSetName}
              disabled={!nameInput.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-500/40 hover:bg-emerald-500/60
                         text-white text-lg font-bold transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed min-w-[80px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              ¡Dale!
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Welcome message */}
      {!showNameInput && (
        <motion.div
          className="w-full mb-6 p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦉</span>
            <p className="text-white/80">
              ¿Listo para jugar con números? Elegí una lección para empezar 👇
            </p>
          </div>
        </motion.div>
      )}

      {/* Lesson path */}
      <div className="w-full flex flex-col gap-3">
        {LESSONS.map((lesson, i) => {
          const lessonProgress = progress.lessons[lesson.slug];
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              status={lessonProgress?.status ?? 'locked'}
              bestScore={lessonProgress?.bestScore ?? 0}
              index={i}
            />
          );
        })}
      </div>

      {/* Footer */}
      <motion.p
        className="mt-12 text-sm text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Portal Bosque 🌿 Aprender Jugando
      </motion.p>
    </main>
  );
}
