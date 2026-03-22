'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TutorMessageProps {
  message: string;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export default function TutorMessage({
  message,
  typingSpeed = 30,
  onTypingComplete,
}: TutorMessageProps) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayed('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(interval);
        setIsTyping(false);
        onTypingComplete?.();
      }
    }, typingSpeed);
    return () => clearInterval(interval);
  }, [message, typingSpeed, onTypingComplete]);

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-white text-lg leading-relaxed"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="min-h-[1.5em]">
        {displayed}
        {isTyping && (
          <motion.span
            className="inline-block w-2 h-5 bg-white/60 ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </p>
    </motion.div>
  );
}
