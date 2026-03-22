// =============================================================================
// Bosque Math v2 — Tutoria Registry
// =============================================================================

import type { TutoriaConfig } from '../../types';
import { TUTORIA_1_1 } from './1-1-subitizing';
import { TUTORIA_2_1 } from './2-1-juntamos';
import { TUTORIA_2_3 } from './2-3-sumas-hasta-5';

/** All available tutoria configs, keyed by tutoriaId */
const TUTORIAS: Record<string, TutoriaConfig> = {
  '1.1': TUTORIA_1_1,
  '2.1': TUTORIA_2_1,
  '2.3': TUTORIA_2_3,
};

/** Ordered list of all tutoria IDs in curriculum order */
const TUTORIA_ORDER: string[] = [
  // Módulo 1
  '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8',
  // Módulo 2
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10',
  // Módulo 3
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8',
  // Módulo 4
  '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8',
  // Módulo 5
  '5.1', '5.2', '5.3', '5.4', '5.5',
  // Módulo 6
  '6.1', '6.2', '6.3', '6.4', '6.5',
  // Módulo 7
  '7.1', '7.2', '7.3', '7.4', '7.5', '7.6',
  // Módulo 8
  '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8',
  // Módulo 9
  '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9', '9.10',
  // Módulo 10
  '10.1', '10.2', '10.3', '10.4', '10.5', '10.6',
  // Módulo 11
  '11.1', '11.2', '11.3', '11.4', '11.5',
  // Módulo 12
  '12.1', '12.2', '12.3', '12.4',
  // Módulo 13
  '13.1', '13.2', '13.3', '13.4',
  // Módulo 14
  '14.1', '14.2', '14.3', '14.4', '14.5',
  // Módulo 15
  '15.1', '15.2', '15.3', '15.4', '15.5', '15.6', '15.7', '15.8',
  // Módulo 16
  '16.1', '16.2', '16.3', '16.4', '16.5',
  // Módulo 17
  '17.1', '17.2', '17.3',
  // Módulo 18
  '18.1', '18.2', '18.3', '18.4',
];

/** Get a tutoria config by ID. Returns undefined if not yet implemented. */
export function getTutoria(id: string): TutoriaConfig | undefined {
  return TUTORIAS[id];
}

/** Get all implemented tutorias for a module */
export function getTutoriasForModulo(moduloId: number): TutoriaConfig[] {
  return Object.values(TUTORIAS).filter((t) => t.modulo === moduloId);
}

/** Get all tutoria IDs for a module (even unimplemented ones) */
export function getTutoriaIdsForModulo(moduloId: number): string[] {
  return TUTORIA_ORDER.filter((id) => {
    const modulo = parseInt(id.split('.')[0], 10);
    return modulo === moduloId;
  });
}

/** Get the next tutoria in curriculum order */
export function getNextTutoria(currentId: string): string | undefined {
  const idx = TUTORIA_ORDER.indexOf(currentId);
  if (idx === -1 || idx === TUTORIA_ORDER.length - 1) return undefined;
  return TUTORIA_ORDER[idx + 1];
}

/** Check if a tutoria config has been implemented */
export function isTutoriaImplemented(id: string): boolean {
  return id in TUTORIAS;
}

export { TUTORIAS, TUTORIA_ORDER };
