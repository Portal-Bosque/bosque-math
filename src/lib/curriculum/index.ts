// =============================================================================
// Bosque Math v2 — Module Registry (18 modules, 122 tutorias)
// =============================================================================

import type { ModuleConfig } from '../types';

export const MODULES: ModuleConfig[] = [
  // ─── 🌱 NIVEL SEMILLA (Primary 1, 6-7 años) ───
  {
    id: 1,
    name: 'Números hasta 20',
    nivel: 'semilla',
    icon: '🔢',
    description: 'Subitizing, conteo, comparación y orden de números del 0 al 20',
    prerequisiteModules: [],
    tutoriaCount: 8,
  },
  {
    id: 2,
    name: 'Suma hasta 10',
    nivel: 'semilla',
    icon: '➕',
    description: 'Sumar como juntar grupos, fluidez con sumas hasta 10, number bonds',
    prerequisiteModules: [1],
    tutoriaCount: 10,
  },
  {
    id: 3,
    name: 'Resta hasta 10',
    nivel: 'semilla',
    icon: '➖',
    description: 'Restar como quitar, fluidez con restas hasta 10, operaciones inversas',
    prerequisiteModules: [2],
    tutoriaCount: 8,
  },
  {
    id: 4,
    name: 'Suma y Resta hasta 20',
    nivel: 'semilla',
    icon: '🔄',
    description: 'Hacer 10 para sumar, casi dobles, sumas y restas cruzando el 10',
    prerequisiteModules: [2, 3],
    tutoriaCount: 8,
  },
  {
    id: 5,
    name: 'Figuras y Patrones',
    nivel: 'semilla',
    icon: '🔷',
    description: 'Figuras 2D y 3D, simetría, patrones repetitivos',
    prerequisiteModules: [1],
    tutoriaCount: 5,
  },
  {
    id: 6,
    name: 'Medir y Comparar',
    nivel: 'semilla',
    icon: '📏',
    description: 'Longitud, peso, tiempo, monedas con unidades no estándar y estándar',
    prerequisiteModules: [1],
    tutoriaCount: 5,
  },

  // ─── 🌿 NIVEL BROTE (Primary 2, 7-8 años) ───
  {
    id: 7,
    name: 'Números hasta 100',
    nivel: 'brote',
    icon: '💯',
    description: 'Valor posicional decenas-unidades, tabla del 100, par e impar',
    prerequisiteModules: [4],
    tutoriaCount: 6,
  },
  {
    id: 8,
    name: 'Suma y Resta hasta 100',
    nivel: 'brote',
    icon: '🧮',
    description: 'Algoritmos con y sin reagrupación, estimación, word problems',
    prerequisiteModules: [7],
    tutoriaCount: 8,
  },
  {
    id: 9,
    name: 'Introducción a la Multiplicación',
    nivel: 'brote',
    icon: '✖️',
    description: 'Grupos iguales, skip counting, tablas del 2-5 y 10, arrays',
    prerequisiteModules: [8],
    tutoriaCount: 10,
  },
  {
    id: 10,
    name: 'Introducción a la División',
    nivel: 'brote',
    icon: '➗',
    description: 'Repartir, agrupar, mitades, operaciones inversas con multiplicación',
    prerequisiteModules: [9],
    tutoriaCount: 6,
  },
  {
    id: 11,
    name: 'Medición Estándar',
    nivel: 'brote',
    icon: '⚖️',
    description: 'Centímetros, metros, kilogramos, litros, reloj completo, perímetro',
    prerequisiteModules: [6],
    tutoriaCount: 5,
  },
  {
    id: 12,
    name: 'Geometría y Datos',
    nivel: 'brote',
    icon: '📊',
    description: 'Figuras avanzadas, área con cuadraditos, gráficos de barras y pictogramas',
    prerequisiteModules: [5],
    tutoriaCount: 4,
  },

  // ─── 🌳 NIVEL RAMA (Primary 3, 8-9 años) ───
  {
    id: 13,
    name: 'Números hasta 1000',
    nivel: 'rama',
    icon: '🏔️',
    description: 'Valor posicional C-D-U, leer/escribir, comparar, redondear',
    prerequisiteModules: [8],
    tutoriaCount: 4,
  },
  {
    id: 14,
    name: 'Operaciones hasta 1000',
    nivel: 'rama',
    icon: '🚀',
    description: 'Suma y resta de 3 dígitos con reagrupación, estimación, multi-paso',
    prerequisiteModules: [13],
    tutoriaCount: 5,
  },
  {
    id: 15,
    name: 'Multiplicación y División Completa',
    nivel: 'rama',
    icon: '⚡',
    description: 'Tablas completas 1-10, multiplicar 2 dígitos, división con resto',
    prerequisiteModules: [9, 10],
    tutoriaCount: 8,
  },
  {
    id: 16,
    name: 'Fracciones',
    nivel: 'rama',
    icon: '🍕',
    description: 'Partes iguales, fracciones unitarias, recta numérica, equivalentes',
    prerequisiteModules: [13],
    tutoriaCount: 5,
  },
  {
    id: 17,
    name: 'Datos y Gráficos',
    nivel: 'rama',
    icon: '📈',
    description: 'Gráficos con escala, recolección de datos, resolver con datos',
    prerequisiteModules: [12],
    tutoriaCount: 3,
  },
  {
    id: 18,
    name: 'Geometría Avanzada',
    nivel: 'rama',
    icon: '📐',
    description: 'Ángulos, perímetro con fórmula, área con fórmula, relación área/perímetro',
    prerequisiteModules: [12],
    tutoriaCount: 4,
  },
];

/** Get a module by its ID */
export function getModule(id: number): ModuleConfig | undefined {
  return MODULES.find((m) => m.id === id);
}

/** Get all modules for a given level */
export function getModulesForLevel(nivel: 'semilla' | 'brote' | 'rama'): ModuleConfig[] {
  return MODULES.filter((m) => m.nivel === nivel);
}

/** Get the next module in sequence (by id order) */
export function getNextModule(currentId: number): ModuleConfig | undefined {
  const idx = MODULES.findIndex((m) => m.id === currentId);
  if (idx === -1 || idx === MODULES.length - 1) return undefined;
  return MODULES[idx + 1];
}
