'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Tile from './Tile';

interface DraggableTileProps {
  id: string;
  value: number;
  size?: number;
  showNumber?: boolean;
}

export default function DraggableTile({ id, value, size = 64, showNumber = true }: DraggableTileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { value },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Tile value={value} size={size} showNumber={showNumber} />
    </div>
  );
}
