'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import Tile from '@/components/tiles/Tile';
import TilePalette from '@/components/tiles/TilePalette';

interface DroppedTile {
  id: string;
  value: number;
}

interface WorkspaceProps {
  /** Target sum to reach (if in exercise mode) */
  targetSum?: number;
  /** Max tile value available in palette */
  maxTileValue?: number;
  /** Callback when sum changes */
  onSumChange?: (tiles: DroppedTile[], sum: number) => void;
  /** Callback when target is reached */
  onTargetReached?: () => void;
  /** Whether workspace is interactive */
  disabled?: boolean;
  /** Pre-placed tiles */
  initialTiles?: DroppedTile[];
}

function DropZone({ children, id }: { children: React.ReactNode; id: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-h-[200px] rounded-2xl border-2 border-dashed
        transition-colors duration-200 flex flex-wrap items-center justify-center gap-3 p-6
        ${isOver ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/20 bg-white/5'}
      `}
    >
      {children}
    </div>
  );
}

export default function Workspace({
  targetSum,
  maxTileValue = 10,
  onSumChange,
  onTargetReached,
  disabled = false,
  initialTiles = [],
}: WorkspaceProps) {
  const [droppedTiles, setDroppedTiles] = useState<DroppedTile[]>(initialTiles);
  const [activeDragValue, setActiveDragValue] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const currentSum = droppedTiles.reduce((s, t) => s + t.value, 0);

  const handleDragStart = useCallback((event: { active: { data: { current?: { value?: number } } } }) => {
    setActiveDragValue(event.active.data.current?.value ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragValue(null);
      if (disabled) return;

      const { over, active } = event;
      if (!over || over.id !== 'workspace-drop') return;

      const value = active.data.current?.value as number | undefined;
      if (!value) return;

      const newTile: DroppedTile = {
        id: `dropped-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        value,
      };

      const newTiles = [...droppedTiles, newTile];
      const newSum = newTiles.reduce((s, t) => s + t.value, 0);
      setDroppedTiles(newTiles);
      onSumChange?.(newTiles, newSum);

      if (targetSum && newSum === targetSum) {
        onTargetReached?.();
      }
    },
    [droppedTiles, disabled, targetSum, onSumChange, onTargetReached]
  );

  const removeTile = useCallback(
    (tileId: string) => {
      if (disabled) return;
      const newTiles = droppedTiles.filter((t) => t.id !== tileId);
      const newSum = newTiles.reduce((s, t) => s + t.value, 0);
      setDroppedTiles(newTiles);
      onSumChange?.(newTiles, newSum);
    },
    [droppedTiles, disabled, onSumChange]
  );

  const clearWorkspace = useCallback(() => {
    setDroppedTiles([]);
    onSumChange?.([], 0);
  }, [onSumChange]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 flex-1">
        {/* Target indicator */}
        {targetSum !== undefined && (
          <div className="text-center">
            <span className="text-white/60 text-lg">Objetivo: </span>
            <span className="text-3xl font-bold text-white">{targetSum}</span>
          </div>
        )}

        {/* Drop zone */}
        <DropZone id="workspace-drop">
          {droppedTiles.length === 0 ? (
            <p className="text-white/40 text-lg select-none">
              Arrastrá fichas acá ↓
            </p>
          ) : (
            <AnimatePresence>
              {droppedTiles.map((tile) => (
                <motion.div
                  key={tile.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => removeTile(tile.id)}
                  className="cursor-pointer"
                  title="Click para quitar"
                >
                  <Tile value={tile.value} size={72} showNumber />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </DropZone>

        {/* Equation display */}
        {droppedTiles.length > 0 && (
          <motion.div
            className="text-center py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-2xl font-bold text-white">
              {droppedTiles.map((t) => t.value).join(' + ')} = {currentSum}
            </span>
            {targetSum !== undefined && currentSum === targetSum && (
              <motion.span
                className="ml-3 text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                ✅
              </motion.span>
            )}
          </motion.div>
        )}

        {/* Clear button */}
        {droppedTiles.length > 0 && !disabled && (
          <button
            onClick={clearWorkspace}
            className="self-center px-4 py-2 text-sm text-white/60 hover:text-white/90 
                       bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            Limpiar ✕
          </button>
        )}

        {/* Tile palette */}
        <div className="mt-auto pt-4">
          <TilePalette maxValue={maxTileValue} tileSize={56} />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDragValue !== null && (
          <Tile value={activeDragValue} size={72} showNumber />
        )}
      </DragOverlay>
    </DndContext>
  );
}
