'use client';

import Workspace from '@/components/workspace/Workspace';

interface TileSumProps {
  targetSum: number;
  maxTileValue?: number;
  onCorrect: () => void;
  disabled?: boolean;
}

export default function TileSum({
  targetSum,
  maxTileValue = 10,
  onCorrect,
  disabled = false,
}: TileSumProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Workspace
        targetSum={targetSum}
        maxTileValue={maxTileValue}
        onTargetReached={onCorrect}
        disabled={disabled}
      />
    </div>
  );
}
