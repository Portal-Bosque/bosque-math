'use client';

import { motion } from 'framer-motion';

interface StarBarProps {
  stars: boolean[];
  size?: 'sm' | 'md' | 'lg';
}

export default function StarBar({ stars, size = 'md' }: StarBarProps) {
  const starSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <div className="flex items-center gap-1">
      {stars.map((filled, i) => (
        <motion.span
          key={i}
          className={starSize}
          initial={filled ? { scale: 0, rotate: -180 } : { scale: 1 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, delay: filled ? i * 0.1 : 0 }}
        >
          {filled ? '🌟' : '⭐'}
        </motion.span>
      ))}
    </div>
  );
}
