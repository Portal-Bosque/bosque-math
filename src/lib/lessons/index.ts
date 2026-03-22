// Lesson registry with metadata

export type LessonPhase = 'exploration' | 'explanation' | 'exercises';

export interface LessonMeta {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  phases: LessonPhase[];
  exerciseCount: number;
}

export const LESSONS: LessonMeta[] = [
  {
    id: 0,
    slug: '0',
    title: '¿Cuántos ves?',
    description: 'Aprendé a reconocer cantidades de un vistazo',
    icon: '👀',
    phases: ['exploration', 'exercises'],
    exerciseCount: 8,
  },
  {
    id: 1,
    slug: '1',
    title: 'Juntamos',
    description: 'Descubrí qué pasa cuando juntás fichas',
    icon: '🤝',
    phases: ['exploration', 'explanation', 'exercises'],
    exerciseCount: 8,
  },
  {
    id: 2,
    slug: '2',
    title: 'Sumas hasta 5',
    description: 'Practicá sumas con números chiquitos',
    icon: '✋',
    phases: ['exercises'],
    exerciseCount: 8,
  },
];

export function getLessonMeta(lessonId: number): LessonMeta | undefined {
  return LESSONS.find((l) => l.id === lessonId);
}
