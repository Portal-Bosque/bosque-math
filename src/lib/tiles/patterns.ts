// Dot patterns for each number 1-10 (like domino/dice patterns)
// Each pattern is an array of {x, y} normalized coordinates (0-1 range)

export interface DotPosition {
  x: number;
  y: number;
}

export const DOT_PATTERNS: Record<number, DotPosition[]> = {
  1: [
    { x: 0.5, y: 0.5 },
  ],
  2: [
    { x: 0.3, y: 0.3 },
    { x: 0.7, y: 0.7 },
  ],
  3: [
    { x: 0.25, y: 0.25 },
    { x: 0.5,  y: 0.5 },
    { x: 0.75, y: 0.75 },
  ],
  4: [
    { x: 0.3, y: 0.3 },
    { x: 0.7, y: 0.3 },
    { x: 0.3, y: 0.7 },
    { x: 0.7, y: 0.7 },
  ],
  5: [
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.25 },
    { x: 0.5,  y: 0.5 },
    { x: 0.25, y: 0.75 },
    { x: 0.75, y: 0.75 },
  ],
  6: [
    { x: 0.3, y: 0.2 },
    { x: 0.7, y: 0.2 },
    { x: 0.3, y: 0.5 },
    { x: 0.7, y: 0.5 },
    { x: 0.3, y: 0.8 },
    { x: 0.7, y: 0.8 },
  ],
  7: [
    { x: 0.3, y: 0.2 },
    { x: 0.7, y: 0.2 },
    { x: 0.3, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.7, y: 0.5 },
    { x: 0.3, y: 0.8 },
    { x: 0.7, y: 0.8 },
  ],
  8: [
    { x: 0.3, y: 0.15 },
    { x: 0.7, y: 0.15 },
    { x: 0.3, y: 0.38 },
    { x: 0.7, y: 0.38 },
    { x: 0.3, y: 0.62 },
    { x: 0.7, y: 0.62 },
    { x: 0.3, y: 0.85 },
    { x: 0.7, y: 0.85 },
  ],
  9: [
    { x: 0.25, y: 0.2 },
    { x: 0.5,  y: 0.2 },
    { x: 0.75, y: 0.2 },
    { x: 0.25, y: 0.5 },
    { x: 0.5,  y: 0.5 },
    { x: 0.75, y: 0.5 },
    { x: 0.25, y: 0.8 },
    { x: 0.5,  y: 0.8 },
    { x: 0.75, y: 0.8 },
  ],
  10: [
    { x: 0.25, y: 0.15 },
    { x: 0.5,  y: 0.15 },
    { x: 0.75, y: 0.15 },
    { x: 0.25, y: 0.38 },
    { x: 0.5,  y: 0.38 },
    { x: 0.75, y: 0.38 },
    { x: 0.25, y: 0.62 },
    { x: 0.75, y: 0.62 },
    { x: 0.25, y: 0.85 },
    { x: 0.75, y: 0.85 },
  ],
};

export function getDotPattern(n: number): DotPosition[] {
  return DOT_PATTERNS[n] ?? [];
}
