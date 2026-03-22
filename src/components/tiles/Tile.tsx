'use client';

import { motion } from 'framer-motion';
import { getTileColor } from '@/lib/tiles/colors';
import { getDotPattern } from '@/lib/tiles/patterns';

interface TileProps {
  value: number;
  size?: number;
  showNumber?: boolean;
  dimmed?: boolean;
  highlighted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function Tile({
  value,
  size = 64,
  showNumber = false,
  dimmed = false,
  highlighted = false,
  style,
  className = '',
}: TileProps) {
  const color = getTileColor(value);
  const dots = getDotPattern(value);
  const dotRadius = size * 0.06;
  const padding = size * 0.15;
  const innerSize = size - padding * 2;

  return (
    <motion.div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, ...style }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: dimmed ? 0.4 : 1,
        scale: 1,
        boxShadow: highlighted ? `0 0 16px 4px ${color.hex}80` : undefined,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background rounded rect */}
        <rect
          x={2}
          y={2}
          width={size - 4}
          height={size - 4}
          rx={size * 0.15}
          ry={size * 0.15}
          fill={color.hex}
          stroke={`${color.hex}CC`}
          strokeWidth={2}
          filter="url(#tileShadow)"
        />

        {/* Shadow filter */}
        <defs>
          <filter id="tileShadow" x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx={0} dy={2} stdDeviation={2} floodColor="#00000040" />
          </filter>
        </defs>

        {/* Dot pattern */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={padding + dot.x * innerSize}
            cy={padding + dot.y * innerSize}
            r={dotRadius}
            fill="white"
            opacity={0.95}
          />
        ))}

        {/* Optional number overlay */}
        {showNumber && (
          <text
            x={size / 2}
            y={size - 6}
            textAnchor="middle"
            fontSize={size * 0.18}
            fill="white"
            fontWeight="bold"
            opacity={0.8}
          >
            {value}
          </text>
        )}
      </svg>
    </motion.div>
  );
}
