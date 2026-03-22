// Rainbow color map for tiles 1-10

export interface TileColor {
  hex: string;
  name: string;
  bg: string;
  border: string;
  text: string;
}

export const TILE_COLORS: Record<number, TileColor> = {
  1:  { hex: '#EF4444', name: 'red',    bg: 'bg-red-500',    border: 'border-red-600',    text: 'text-red-500' },
  2:  { hex: '#F97316', name: 'orange', bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-orange-500' },
  3:  { hex: '#EAB308', name: 'yellow', bg: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-500' },
  4:  { hex: '#22C55E', name: 'green',  bg: 'bg-green-500',  border: 'border-green-600',  text: 'text-green-500' },
  5:  { hex: '#3B82F6', name: 'blue',   bg: 'bg-blue-500',   border: 'border-blue-600',   text: 'text-blue-500' },
  6:  { hex: '#6366F1', name: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-600', text: 'text-indigo-500' },
  7:  { hex: '#8B5CF6', name: 'violet', bg: 'bg-violet-500', border: 'border-violet-600', text: 'text-violet-500' },
  8:  { hex: '#EC4899', name: 'pink',   bg: 'bg-pink-500',   border: 'border-pink-600',   text: 'text-pink-500' },
  9:  { hex: '#14B8A6', name: 'teal',   bg: 'bg-teal-500',   border: 'border-teal-600',   text: 'text-teal-500' },
  10: { hex: '#F59E0B', name: 'amber',  bg: 'bg-amber-500',  border: 'border-amber-600',  text: 'text-amber-500' },
};

export function getTileColor(n: number): TileColor {
  return TILE_COLORS[n] ?? TILE_COLORS[1];
}
