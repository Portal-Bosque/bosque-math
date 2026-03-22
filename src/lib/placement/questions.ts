// =============================================================================
// Bosque Math v2 — Placement Test Questions
// 15 questions covering modules 1-15, adaptive branching
// =============================================================================

import type { PlacementQuestion } from '../types';

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ─── Módulo 1: Números hasta 20 ───
  {
    id: 'p1',
    question: '¿Cuántas estrellas ves? ⭐⭐⭐',
    options: [
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
    ],
    correctValue: 3,
    moduloIfCorrect: 2,
    moduloIfWrong: 1,
    difficulty: 1,
  },

  // ─── Módulo 2: Suma hasta 10 ───
  {
    id: 'p2',
    question: '¿Cuánto es 3 + 2?',
    options: [
      { text: '4', value: 4 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
    ],
    correctValue: 5,
    moduloIfCorrect: 3,
    moduloIfWrong: 1,
    difficulty: 2,
  },

  // ─── Módulo 3: Resta hasta 10 ───
  {
    id: 'p3',
    question: '¿Cuánto es 7 - 3?',
    options: [
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
    correctValue: 4,
    moduloIfCorrect: 4,
    moduloIfWrong: 2,
    difficulty: 3,
  },

  // ─── Módulo 4: Suma y Resta hasta 20 ───
  {
    id: 'p4',
    question: '¿Cuánto es 8 + 5?',
    options: [
      { text: '12', value: 12 },
      { text: '13', value: 13 },
      { text: '14', value: 14 },
    ],
    correctValue: 13,
    moduloIfCorrect: 7,
    moduloIfWrong: 3,
    difficulty: 4,
  },

  // ─── Módulo 4b: Resta cruzando 10 ───
  {
    id: 'p5',
    question: '¿Cuánto es 15 - 7?',
    options: [
      { text: '7', value: 7 },
      { text: '8', value: 8 },
      { text: '9', value: 9 },
    ],
    correctValue: 8,
    moduloIfCorrect: 7,
    moduloIfWrong: 3,
    difficulty: 5,
  },

  // ─── Módulo 7: Números hasta 100 ───
  {
    id: 'p6',
    question: '¿Cuántas decenas hay en 47?',
    options: [
      { text: '4', value: 4 },
      { text: '7', value: 7 },
      { text: '47', value: 47 },
    ],
    correctValue: 4,
    moduloIfCorrect: 8,
    moduloIfWrong: 4,
    difficulty: 6,
  },

  // ─── Módulo 8: Suma hasta 100 ───
  {
    id: 'p7',
    question: '¿Cuánto es 36 + 27?',
    options: [
      { text: '53', value: 53 },
      { text: '63', value: 63 },
      { text: '73', value: 73 },
    ],
    correctValue: 63,
    moduloIfCorrect: 9,
    moduloIfWrong: 7,
    difficulty: 7,
  },

  // ─── Módulo 8b: Resta hasta 100 ───
  {
    id: 'p8',
    question: '¿Cuánto es 53 - 28?',
    options: [
      { text: '25', value: 25 },
      { text: '35', value: 35 },
      { text: '31', value: 31 },
    ],
    correctValue: 25,
    moduloIfCorrect: 9,
    moduloIfWrong: 7,
    difficulty: 8,
  },

  // ─── Módulo 9: Multiplicación ───
  {
    id: 'p9',
    question: 'Hay 4 nidos con 3 huevos cada uno. ¿Cuántos huevos hay en total?',
    options: [
      { text: '7', value: 7 },
      { text: '12', value: 12 },
      { text: '10', value: 10 },
    ],
    correctValue: 12,
    moduloIfCorrect: 10,
    moduloIfWrong: 8,
    difficulty: 9,
  },

  // ─── Módulo 9b: Tablas ───
  {
    id: 'p10',
    question: '¿Cuánto es 5 × 4?',
    options: [
      { text: '15', value: 15 },
      { text: '20', value: 20 },
      { text: '25', value: 25 },
    ],
    correctValue: 20,
    moduloIfCorrect: 10,
    moduloIfWrong: 8,
    difficulty: 10,
  },

  // ─── Módulo 10: División ───
  {
    id: 'p11',
    question: 'Tenés 12 galletitas para repartir entre 3 amigos. ¿Cuántas le tocan a cada uno?',
    options: [
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '6', value: 6 },
    ],
    correctValue: 4,
    moduloIfCorrect: 13,
    moduloIfWrong: 9,
    difficulty: 11,
  },

  // ─── Módulo 13: Números hasta 1000 ───
  {
    id: 'p12',
    question: '¿Cuántas centenas, decenas y unidades hay en 583?',
    options: [
      { text: '5 centenas, 8 decenas, 3 unidades', value: 1 },
      { text: '5 centenas, 3 decenas, 8 unidades', value: 2 },
      { text: '8 centenas, 5 decenas, 3 unidades', value: 3 },
    ],
    correctValue: 1,
    moduloIfCorrect: 14,
    moduloIfWrong: 10,
    difficulty: 12,
  },

  // ─── Módulo 14: Operaciones hasta 1000 ───
  {
    id: 'p13',
    question: '¿Cuánto es 456 + 278?',
    options: [
      { text: '634', value: 634 },
      { text: '724', value: 724 },
      { text: '734', value: 734 },
    ],
    correctValue: 734,
    moduloIfCorrect: 15,
    moduloIfWrong: 13,
    difficulty: 13,
  },

  // ─── Módulo 15: Multiplicación completa ───
  {
    id: 'p14',
    question: '¿Cuánto es 7 × 8?',
    options: [
      { text: '48', value: 48 },
      { text: '54', value: 54 },
      { text: '56', value: 56 },
    ],
    correctValue: 56,
    moduloIfCorrect: 16,
    moduloIfWrong: 14,
    difficulty: 14,
  },

  // ─── Módulo 15b: División con resto ───
  {
    id: 'p15',
    question: 'Si repartís 17 caramelos entre 5 chicos, ¿cuántos le tocan a cada uno y cuántos sobran?',
    options: [
      { text: '3 cada uno, sobran 2', value: 1 },
      { text: '4 cada uno, sobra 1', value: 2 },
      { text: '3 cada uno, sobran 3', value: 3 },
    ],
    correctValue: 1,
    moduloIfCorrect: 16,
    moduloIfWrong: 14,
    difficulty: 15,
  },
];
