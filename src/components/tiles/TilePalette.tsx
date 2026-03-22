'use client';

import DraggableTile from './DraggableTile';

interface TilePaletteProps {
  maxValue?: number;
  tileSize?: number;
}

export default function TilePalette({ maxValue = 10, tileSize = 56 }: TilePaletteProps) {
  const values = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-black/30 backdrop-blur-sm">
      {values.map((v) => (
        <DraggableTile
          key={`palette-${v}`}
          id={`palette-${v}`}
          value={v}
          size={tileSize}
          showNumber={true}
        />
      ))}
    </div>
  );
}
