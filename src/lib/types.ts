// =============================================================================
// Bosque Math v2 — Types
// =============================================================================

/** Lesson plan JSON structure */
export interface TutoriaConfig {
  tutoriaId: string; // e.g. "2.1"
  titulo: string;
  modulo: number;
  nivel: 'semilla' | 'brote' | 'rama';
  concepto: string;
  prerequisitos: string[];
  edadTarget: number[];
  duracionMinutos: number;
  fases: Phase[];
  spacedRepetition: {
    conceptosARepasar: string[];
    ejerciciosRepaso: number;
  };
}

export interface Phase {
  tipo: 'exploracion' | 'guiada' | 'ejercicios';
  instruccionesTutor: string;
  preguntasComprension?: ComprehensionQuestion[];
  ejerciciosGuiados?: GuidedExercise[];
  cantidad?: number;
  tipos?: ExerciseType[];
  nivelAdaptativo?: {
    inicio: 1 | 2 | 3;
    subirDespuesDe: number;
    bajarDespuesDe: number;
  };
}

export interface ComprehensionQuestion {
  pregunta: string;
  opciones: string[];
  correcta: number;
  feedbackCorrecto: string;
  feedbackIncorrecto: string;
}

export interface GuidedExercise {
  tipo: string;
  fichas?: number[];
  ecuacion?: string;
  respuesta: number;
}

export type ExerciseType =
  | 'suma_directa'
  | 'multiple_choice'
  | 'fichas'
  | 'verdadero_falso'
  | 'numero_faltante'
  | 'subitizing';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  correctAnswer: number;
  options?: number[];
  tiles?: number[];
  equation?: string;
  isReview?: boolean;
  fromTutoria?: string;
}

/** Tutor AI response format */
export interface TutorResponse {
  message: string;
  action:
    | 'explain'
    | 'ask_question'
    | 'give_feedback'
    | 'transition'
    | 'celebrate'
    | 'hint'
    | 'simplify';
  options?: { text: string; correct?: boolean; value?: number }[];
  showTiles?: boolean;
  tileConfig?: { numbers: number[]; target?: number };
  waitSeconds?: number;
  nextPhase?: boolean;
}

/** Student state */
export interface StudentProgress {
  name: string;
  age: number;
  placementCompleted: boolean;
  currentModulo: number;
  currentTutoria: string;
  tutorias: Record<string, TutoriaProgress>;
  spacedRepetition: SpacedRepetitionState;
}

export interface TutoriaProgress {
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  bestScore: number;
  attempts: number;
  lastAttemptDate: string;
  adaptiveLevel: 1 | 2 | 3;
  masteryScore: number; // 0-100
}

export interface SpacedRepetitionState {
  reviews: SpacedRepetitionReview[];
}

export interface SpacedRepetitionReview {
  tutoriaId: string;
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
}

/** Placement test */
export interface PlacementQuestion {
  id: string;
  question: string;
  options: { text: string; value: number }[];
  correctValue: number;
  moduloIfCorrect: number;
  moduloIfWrong: number;
  difficulty: number;
}

export interface PlacementResult {
  startingModulo: number;
  startingTutoria: string;
  strengths: string[];
  areasToWork: string[];
}

/** Module metadata */
export interface ModuleConfig {
  id: number;
  name: string;
  nivel: 'semilla' | 'brote' | 'rama';
  icon: string;
  description: string;
  prerequisiteModules: number[];
  tutoriaCount: number;
}
