/**
 * Tipos e interfaces del embudo "Selección Ser Empresario".
 *
 * Se agrupan en cuatro bloques:
 *  1. Catálogo de preguntas (contenido del diagnóstico ScoreApp).
 *  2. Datos de entrada del usuario (respuestas, contacto, preferencias).
 *  3. Entidades de resultado (puntuación, categorías, segmentos).
 *  4. Estado global del embudo (reducer + acciones).
 */

// ---------------------------------------------------------------------------
// 1. Catálogo de preguntas
// ---------------------------------------------------------------------------

/** Las cinco categorías del Índice de Relevancia Empresarial (ver plan de embudo, sección 8). */
export type CategoryKey =
  | 'trayectoria'
  | 'liderazgo'
  | 'impacto'
  | 'diferenciacion'
  | 'momentoEditorial';

export interface CategoryWeight {
  key: CategoryKey;
  label: string;
  description: string;
  /** Peso relativo de la categoría en la puntuación final (0–1). La suma de todas debe ser 1. */
  weight: number;
}

export type QuestionKind = 'single-select' | 'likert' | 'boolean' | 'text';

export interface SelectOption {
  value: string;
  label: string;
  /** Contribución de 0 a 100 hacia la categoría de la pregunta. */
  score: number;
}

interface BaseQuestion {
  /** Identificador único; se usa como llave en el diccionario de respuestas. */
  id: string;
  order: number;
  prompt: string;
  helperText?: string;
  /** 'meta' se usa para preguntas cualitativas que no puntúan (pero sí se capturan para el equipo editorial). */
  category: CategoryKey | 'meta';
  required: boolean;
}

export interface SingleSelectQuestion extends BaseQuestion {
  kind: 'single-select';
  options: SelectOption[];
}

export interface LikertQuestion extends BaseQuestion {
  kind: 'likert';
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  /** Convierte el valor crudo del slider (min–max) en una contribución de 0 a 100. */
  scoreFromValue: (value: number) => number;
}

export interface BooleanQuestion extends BaseQuestion {
  kind: 'boolean';
  trueLabel: string;
  falseLabel: string;
  trueScore: number;
  falseScore: number;
}

export interface TextQuestion extends BaseQuestion {
  kind: 'text';
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}

export type FunnelQuestion = SingleSelectQuestion | LikertQuestion | BooleanQuestion | TextQuestion;

// ---------------------------------------------------------------------------
// 2. Datos de entrada del usuario
// ---------------------------------------------------------------------------

export type AnswerValue = string | number | boolean;

/** Diccionario `questionId -> valor respondido`. */
export type QuestionAnswers = Record<string, AnswerValue>;

export interface ContactInfo {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  linkedin: string;
}

export const EMPTY_CONTACT: ContactInfo = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  linkedin: '',
};

export interface FunnelPreferences {
  disponibleParaEntrevista: boolean | null;
  periodoDeseado: string;
}

export const EMPTY_PREFERENCES: FunnelPreferences = {
  disponibleParaEntrevista: null,
  periodoDeseado: '',
};

/** Errores de validación por campo, usados en los formularios de contacto/preferencias. */
export type FormErrors<T extends string = string> = Partial<Record<T, string>>;

// ---------------------------------------------------------------------------
// 3. Entidades de resultado
// ---------------------------------------------------------------------------

export interface CategoryScore {
  key: CategoryKey;
  label: string;
  /** Puntuación de la categoría, 0–100. */
  score: number;
  weight: number;
  /** score * weight, ya expresado en puntos sobre 100. */
  weightedContribution: number;
}

export type SegmentId = 'alto-potencial' | 'consolidacion' | 'posicionamiento' | 'comunidad';

export interface SegmentContent {
  id: SegmentId;
  minScore: number;
  maxScore: number;
  badge: string;
  title: string;
  message: string;
  ctaLabel: string;
  /** Si es true, el segmento habilita la solicitud directa de entrevista editorial. */
  offersInterview: boolean;
  /** Clases Tailwind para acentuar la tarjeta de resultado de este segmento. */
  accentBg: string;
  accentText: string;
  accentRing: string;
}

export interface ScoreResult {
  total: number;
  segment: SegmentContent;
  categoryScores: CategoryScore[];
  computedAt: string;
}

export interface InterviewRequest {
  id: string;
  submittedAt: string;
  contact: ContactInfo;
  scoreTotal: number;
  segmentId: SegmentId;
  preferredSlot: string;
  notes: string;
}

export interface EditionConfig {
  edicionNombre: string;
  cuposTotales: number;
  cuposDisponibles: number;
  fechaLimiteISO: string;
  ciudad: string;
}

// ---------------------------------------------------------------------------
// 4. Estado global del embudo
// ---------------------------------------------------------------------------

export type FunnelPhase = 'landing' | 'quiz' | 'analyzing' | 'result';

export interface FunnelState {
  phase: FunnelPhase;
  stepIndex: number;
  answers: QuestionAnswers;
  contact: ContactInfo;
  preferences: FunnelPreferences;
  result: ScoreResult | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  interviewRequest: InterviewRequest | null;
}

export type FunnelAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; questionId: string; value: AnswerValue }
  | { type: 'UPDATE_CONTACT'; field: keyof ContactInfo; value: string }
  | { type: 'UPDATE_PREFERENCES'; field: keyof FunnelPreferences; value: string | boolean }
  | { type: 'GO_TO_STEP'; stepIndex: number }
  | { type: 'NEXT_STEP'; totalSteps: number }
  | { type: 'PREV_STEP' }
  | { type: 'BEGIN_ANALYSIS' }
  | { type: 'COMPLETE_ANALYSIS'; result: ScoreResult }
  | { type: 'SUBMIT_INTERVIEW_REQUEST'; request: InterviewRequest }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; state: Partial<FunnelState> };

/** Forma persistida en localStorage (subconjunto serializable del estado). */
export interface PersistedFunnelState {
  phase: FunnelPhase;
  stepIndex: number;
  answers: QuestionAnswers;
  contact: ContactInfo;
  preferences: FunnelPreferences;
  result: ScoreResult | null;
  interviewRequest: InterviewRequest | null;
}
