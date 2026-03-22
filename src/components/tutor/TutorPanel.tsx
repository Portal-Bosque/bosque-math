'use client';

import { motion } from 'framer-motion';
import TutorMessage from './TutorMessage';

interface TutorPanelProps {
  message: string;
  children?: React.ReactNode;
  onHelpClick?: () => void;
  showHelp?: boolean;
}

export default function TutorPanel({
  message,
  children,
  onHelpClick,
  showHelp = true,
}: TutorPanelProps) {
  return (
    <motion.aside
      className="w-full lg:w-80 flex flex-col gap-4 p-4 rounded-2xl bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-4xl" role="img" aria-label="Bosquito">
          🦉
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Bosquito</h3>
          <p className="text-white/50 text-sm">Tu tutor del bosque</p>
        </div>
      </div>

      {/* Message */}
      <TutorMessage message={message} />

      {/* Interactive area (buttons, numpad, etc) */}
      {children && (
        <div className="flex flex-col gap-3">
          {children}
        </div>
      )}

      {/* Help button */}
      {showHelp && onHelpClick && (
        <motion.button
          onClick={onHelpClick}
          className="mt-auto self-center px-6 py-3 rounded-xl bg-amber-500/30 hover:bg-amber-500/50
                     text-white text-lg font-medium transition-colors min-h-[48px]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          🖐️ Necesito ayuda
        </motion.button>
      )}
    </motion.aside>
  );
}
