'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MODULES, getModulesForLevel } from '@/lib/curriculum';
import { getTutoriaIdsForModulo, getTutoria, isTutoriaImplemented } from '@/lib/curriculum/tutorias';
import { getProgress, saveProgress } from '@/lib/storage';
import type { StudentProgress, ModuleConfig, TutoriaProgress } from '@/lib/types';
import ModuleCard from '@/components/dashboard/ModuleCard';
import ModuleDetail from '@/components/dashboard/ModuleDetail';
import PlacementTest from '@/components/placement/PlacementTest';
import type { PlacementResult } from '@/lib/types';
import { completePlacement } from '@/lib/storage';

type DashboardView = 'name' | 'placement' | 'modules' | 'module-detail';

function getModuleStatus(
  module: ModuleConfig,
  progress: StudentProgress,
): 'locked' | 'available' | 'in-progress' | 'completed' {
  // Check prerequisites
  const prereqsMet = module.prerequisiteModules.every((pId) => {
    const pIds = getTutoriaIdsForModulo(pId);
    return pIds.every((tid) => progress.tutorias[tid]?.status === 'completed');
  });

  if (!prereqsMet && module.id !== progress.currentModulo && module.prerequisiteModules.length > 0) {
    return 'locked';
  }

  const tutoriaIds = getTutoriaIdsForModulo(module.id);
  const completedCount = tutoriaIds.filter(
    (tid) => progress.tutorias[tid]?.status === 'completed',
  ).length;

  if (completedCount === tutoriaIds.length && tutoriaIds.length > 0) return 'completed';

  const hasAnyProgress = tutoriaIds.some(
    (tid) =>
      progress.tutorias[tid]?.status === 'in-progress' ||
      progress.tutorias[tid]?.status === 'completed',
  );

  if (hasAnyProgress) return 'in-progress';

  return 'available';
}

function countCompletedTutorias(moduleId: number, progress: StudentProgress): number {
  const ids = getTutoriaIdsForModulo(moduleId);
  return ids.filter((tid) => progress.tutorias[tid]?.status === 'completed').length;
}

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [view, setView] = useState<DashboardView>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  useEffect(() => {
    const p = getProgress();
    setProgress(p);
    if (!p.name) {
      setView('name');
    } else if (!p.placementCompleted) {
      setView('placement');
    }
  }, []);

  const handleSetName = () => {
    if (!nameInput.trim() || !progress) return;
    const updated = { ...progress, name: nameInput.trim() };
    saveProgress(updated);
    setProgress(updated);
    setView('placement');
  };

  const handlePlacementComplete = (result: PlacementResult) => {
    completePlacement(result);
    const updated = getProgress();
    setProgress(updated);
    setView('modules');
  };

  const handleModuleClick = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setView('module-detail');
  };

  const handleSelectTutoria = (tutoriaId: string) => {
    router.push(`/lesson/${tutoriaId}`);
  };

  if (!progress) return null;

  // ── Name input ──
  if (view === 'name') {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
        <motion.div
          className="w-full p-6 rounded-2xl bg-white/10 backdrop-blur-sm"
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
      </main>
    );
  }

  // ── Placement test ──
  if (view === 'placement') {
    return (
      <main className="flex-1 flex flex-col px-4 py-8">
        <PlacementTest
          studentName={progress.name}
          onComplete={handlePlacementComplete}
        />
      </main>
    );
  }

  // ── Module detail ──
  if (view === 'module-detail' && selectedModuleId !== null) {
    const mod = MODULES.find((m) => m.id === selectedModuleId);
    if (!mod) {
      setView('modules');
      return null;
    }

    const tutoriaIds = getTutoriaIdsForModulo(mod.id);
    const tutorias = tutoriaIds.map((tid, i) => {
      const config = getTutoria(tid);
      const tp = progress.tutorias[tid] as TutoriaProgress | undefined;

      // Determine status: first tutoria available if module is available, rest locked until prev complete
      let status: TutoriaProgress['status'] = tp?.status ?? 'locked';
      if (!tp) {
        if (i === 0) {
          status = 'available';
        } else {
          const prevId = tutoriaIds[i - 1];
          const prevStatus = progress.tutorias[prevId]?.status;
          status = prevStatus === 'completed' ? 'available' : 'locked';
        }
      }

      return {
        id: tid,
        title: config?.titulo ?? `Tutoría ${tid}`,
        status,
        bestScore: tp?.bestScore ?? 0,
        stars: tp ? Math.floor(tp.masteryScore / 34) : 0,
      };
    });

    return (
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <ModuleDetail
          module={mod}
          tutorias={tutorias}
          onSelectTutoria={handleSelectTutoria}
          onBack={() => setView('modules')}
        />
      </main>
    );
  }

  // ── Module list (main dashboard) ──
  const levels = ['semilla', 'brote', 'rama'] as const;
  const levelLabels = { semilla: '🌱 Semilla', brote: '🌿 Brote', rama: '🌳 Rama' };

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">🌲 Bosque Math</h1>
        <p className="text-xl text-white/70">¡Hola, {progress.name}! 🦉</p>
      </motion.div>

      {/* Welcome */}
      <motion.div
        className="w-full mb-6 p-4 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦉</span>
          <p className="text-white/80">
            Elegí un módulo para explorar 👇
          </p>
        </div>
      </motion.div>

      {/* Modules by level */}
      {levels.map((nivel) => {
        const mods = getModulesForLevel(nivel);
        if (mods.length === 0) return null;
        return (
          <div key={nivel} className="w-full mb-6">
            <h2 className="text-lg font-bold text-white/60 mb-3">{levelLabels[nivel]}</h2>
            <div className="flex flex-col gap-3">
              {mods.map((mod, i) => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  completedTutorias={countCompletedTutorias(mod.id, progress)}
                  status={getModuleStatus(mod, progress)}
                  onClick={handleModuleClick}
                  index={i}
                />
              ))}
            </div>
          </div>
        );
      })}

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
