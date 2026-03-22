'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TutoriaConfig } from '@/lib/types';
import type { AdaptiveLevel } from '@/lib/engine/adaptive';

interface DebugPanelProps {
  tutoria: TutoriaConfig;
  currentPhase: string;
  currentPhaseIndex: number;
  totalPhases: number;
  completedPhases: string[];
  adaptiveLevel: AdaptiveLevel;
  exerciseProgress?: { current: number; total: number; correct: number };
  onSkipPhase: () => void;
  onCompleteTutoria: () => void;
  onResetProgress: () => void;
  onSetLevel: (level: AdaptiveLevel) => void;
}

export default function DebugPanel({
  tutoria,
  currentPhase,
  currentPhaseIndex,
  totalPhases,
  completedPhases,
  adaptiveLevel,
  exerciseProgress,
  onSkipPhase,
  onCompleteTutoria,
  onResetProgress,
  onSetLevel,
}: DebugPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const phaseExitConditions: Record<string, string> = {
    exploracion: 'El tutor AI envía nextPhase:true, o el usuario interactúa 3+ veces',
    guiada: 'El tutor AI envía nextPhase:true después de preguntas de comprensión',
    ejercicios: `Completar ${tutoria.fases.find(f => f.tipo === 'ejercicios')?.cantidad ?? 8} ejercicios. Avanza si ≥6/8 correctas.`,
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence>
        {!collapsed ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900/95 backdrop-blur-md border border-yellow-500/50 rounded-xl p-4 w-80 shadow-2xl text-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-yellow-400 font-bold text-base">🐛 Debug</h3>
              <button
                onClick={() => setCollapsed(true)}
                className="text-white/50 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Tutoria info */}
            <div className="mb-3 p-2 bg-white/5 rounded-lg">
              <p className="text-white/70">
                <span className="text-yellow-400">Tutoría:</span> {tutoria.tutoriaId} — {tutoria.titulo}
              </p>
              <p className="text-white/70">
                <span className="text-yellow-400">Módulo:</span> {tutoria.modulo} ({tutoria.nivel})
              </p>
              <p className="text-white/70">
                <span className="text-yellow-400">Concepto:</span> {tutoria.concepto}
              </p>
            </div>

            {/* Phase info */}
            <div className="mb-3 p-2 bg-white/5 rounded-lg">
              <p className="text-white/70">
                <span className="text-yellow-400">Fase:</span>{' '}
                <span className="text-white font-bold">{currentPhase}</span>{' '}
                ({currentPhaseIndex + 1}/{totalPhases})
              </p>
              <p className="text-white/70">
                <span className="text-yellow-400">Completadas:</span>{' '}
                {completedPhases.length > 0 ? completedPhases.join(', ') : 'ninguna'}
              </p>
              <p className="text-white/50 mt-1 text-xs">
                <span className="text-yellow-400/70">Condición de salida:</span>{' '}
                {phaseExitConditions[currentPhase] ?? 'Desconocida'}
              </p>
            </div>

            {/* Adaptive level */}
            <div className="mb-3 p-2 bg-white/5 rounded-lg">
              <p className="text-white/70 mb-1">
                <span className="text-yellow-400">Nivel adaptativo:</span> {adaptiveLevel}
              </p>
              <div className="flex gap-1">
                {([1, 2, 3] as AdaptiveLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSetLevel(lvl)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      adaptiveLevel === lvl
                        ? 'bg-yellow-500 text-black'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    Lvl {lvl}
                  </button>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-1">
                1=hasta 5, 2=hasta 10, 3=cruzando 10
              </p>
            </div>

            {/* Exercise progress */}
            {exerciseProgress && (
              <div className="mb-3 p-2 bg-white/5 rounded-lg">
                <p className="text-white/70">
                  <span className="text-yellow-400">Ejercicios:</span>{' '}
                  {exerciseProgress.current}/{exerciseProgress.total}{' '}
                  ({exerciseProgress.correct} correctas)
                </p>
                <p className="text-white/50 text-xs">
                  Avanza con ≥6 correctas de 8
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={onSkipPhase}
                className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 
                           rounded-lg text-sm font-bold transition-colors"
              >
                ⏭️ Saltar fase → siguiente
              </button>
              <button
                onClick={onCompleteTutoria}
                className="w-full px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 
                           rounded-lg text-sm font-bold transition-colors"
              >
                ✅ Completar tutoría (8/8)
              </button>
              <button
                onClick={onResetProgress}
                className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 
                           rounded-lg text-sm font-bold transition-colors"
              >
                🗑️ Reset localStorage
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setCollapsed(false)}
            className="bg-gray-900/90 border border-yellow-500/50 rounded-full p-3 shadow-xl 
                       hover:bg-gray-800 transition-colors"
          >
            <span className="text-xl">🐛</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
