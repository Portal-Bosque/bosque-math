// Lesson 0: Subitizing — recognize quantities without counting

export interface SubitizingRound {
  number: number;
  displayTimeMs: number;
}

/** Scripted tutor flow for lesson 0 */
export const LESSON_0_INTRO = [
  '¡Hola! Hoy vamos a jugar a un juego de ojos rápidos 👀',
  'Te voy a mostrar unos puntitos por un ratito. ¿Podés decirme cuántos son?',
  'No hace falta contarlos uno por uno. Tratá de verlos todos juntos. ¡Empezamos!',
];

export const LESSON_0_EXPLORATION_PROMPTS = [
  'Mirá estas fichas. Cada una tiene puntitos adentro. ¿Cuántos ves en la roja?',
  '¡Bien! Ahora fijate en la azul. ¿Cuántos puntitos tiene?',
  'Las fichas más grandes tienen más puntos. ¿Podés ordenarlas de menor a mayor?',
];

/** Progressive display times (gets faster as kid improves) */
export const DISPLAY_TIMES: Record<number, number> = {
  1: 3000,  // start slow
  2: 2500,
  3: 2500,
  4: 2000,
  5: 2000,
  6: 1500,
  7: 1500,
  8: 1200,
};

/** Generate subitizing rounds with progressive difficulty */
export function generateSubitizingRounds(count: number = 8): SubitizingRound[] {
  const rounds: SubitizingRound[] = [];
  // Start with small numbers, gradually increase
  const sequence = [2, 3, 4, 5, 3, 6, 4, 7, 8, 5, 9, 10];
  
  for (let i = 0; i < count; i++) {
    const num = sequence[i % sequence.length];
    rounds.push({
      number: num,
      displayTimeMs: DISPLAY_TIMES[Math.min(i + 1, 8)] ?? 1500,
    });
  }
  return rounds;
}
