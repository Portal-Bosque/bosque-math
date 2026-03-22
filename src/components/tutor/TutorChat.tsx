'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TutorResponse } from '@/lib/types';
import NumberInput from './NumberInput';
import Workspace from '@/components/workspace/Workspace';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tutorResponse?: TutorResponse;
}

interface TutorChatProps {
  tutoriaId: string;
  phase: string;
  studentName: string;
  studentAge: number;
  tutoriaTitle?: string;
  tutoriaConcept?: string;
  phaseInstructions?: string;
  onPhaseTransition?: () => void;
  onInteraction?: () => void;
  initialMessage?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TutorChat({
  tutoriaId,
  phase,
  studentName,
  studentAge,
  tutoriaTitle,
  tutoriaConcept,
  phaseInstructions,
  onPhaseTransition,
  onInteraction,
  initialMessage,
}: TutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialMessage) {
      return [
        {
          id: 'init',
          role: 'assistant',
          content: initialMessage,
          tutorResponse: { message: initialMessage, action: 'explain' },
        },
      ];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(!initialMessage);
  const [currentResponse, setCurrentResponse] = useState<TutorResponse | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send initial greeting on mount if no initial message
  useEffect(() => {
    if (!initialMessage && messages.length === 0) {
      sendToTutor('¡Hola! Estoy listo para aprender.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendToTutor = useCallback(
    async (userText: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);
      setCurrentResponse(null);
      onInteraction?.();

      try {
        const apiMessages = newMessages.map((m) => ({
          role: m.role,
          content: m.role === 'assistant' && m.tutorResponse
            ? JSON.stringify(m.tutorResponse)
            : m.content,
        }));

        const res = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            tutoriaId,
            phase,
            studentName,
            studentAge,
            tutoriaTitle,
            tutoriaConcept,
            phaseInstructions,
          }),
        });

        const data = (await res.json()) as TutorResponse;

        // Handle wait time
        if (data.waitSeconds && data.waitSeconds > 0) {
          await new Promise((r) => setTimeout(r, data.waitSeconds! * 1000));
        }

        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          tutorResponse: data,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setCurrentResponse(data);

        // Handle phase transition
        if (data.nextPhase && onPhaseTransition) {
          setTimeout(() => onPhaseTransition(), 2000);
        }
      } catch (err) {
        console.error('[TutorChat] Error:', err);
        const fallbackMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: '¡Ups! Dejame pensar de nuevo... 🦉',
          tutorResponse: { message: '¡Ups! Dejame pensar de nuevo... 🦉', action: 'explain' },
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, tutoriaId, phase, studentName, studentAge, tutoriaTitle, tutoriaConcept, phaseInstructions, onPhaseTransition],
  );

  const handleOptionClick = useCallback(
    (opt: { text: string; correct?: boolean; value?: number }) => {
      sendToTutor(opt.text);
    },
    [sendToTutor],
  );

  const handleNumberSubmit = useCallback(
    (value: number) => {
      sendToTutor(String(value));
    },
    [sendToTutor],
  );

  const lastAssistantResponse = currentResponse;

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 px-3 py-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex gap-2 max-w-[90%]">
                  <span className="text-2xl flex-shrink-0 mt-1">🦉</span>
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-white text-lg leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="bg-emerald-500/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                  <p className="text-white text-lg">{msg.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 items-center"
          >
            <span className="text-2xl">🦉</span>
            <div className="bg-white/10 rounded-2xl px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 bg-white/50 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Tiles workspace (if showTiles) */}
      {lastAssistantResponse?.showTiles && lastAssistantResponse.tileConfig && (
        <div className="px-3 py-2 border-t border-white/10">
          <div className="max-h-[200px]">
            <Workspace
              targetSum={lastAssistantResponse.tileConfig.target}
              maxTileValue={Math.max(...(lastAssistantResponse.tileConfig.numbers || [10]))}
              initialTiles={lastAssistantResponse.tileConfig.numbers.map((n, i) => ({
                id: `tile-${i}`,
                value: n,
              }))}
            />
          </div>
        </div>
      )}

      {/* Interaction area */}
      <div className="px-3 py-3 border-t border-white/10 space-y-3">
        {/* Response buttons */}
        {!isLoading && lastAssistantResponse?.options && lastAssistantResponse.options.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {lastAssistantResponse.options.map((opt, i) => (
              <motion.button
                key={`${opt.text}-${i}`}
                onClick={() => handleOptionClick(opt)}
                className="min-h-[56px] px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25
                           text-white text-xl font-bold transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {opt.text}
              </motion.button>
            ))}
          </div>
        )}

        {/* Number input for numeric answers */}
        {!isLoading &&
          lastAssistantResponse?.action === 'ask_question' &&
          (!lastAssistantResponse.options || lastAssistantResponse.options.length === 0) && (
            <NumberInput onSubmit={handleNumberSubmit} />
          )}
      </div>
    </div>
  );
}
