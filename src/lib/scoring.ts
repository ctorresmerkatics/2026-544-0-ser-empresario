import type {
  CategoryKey,
  CategoryScore,
  CategoryWeight,
  FunnelQuestion,
  QuestionAnswers,
  ScoreResult,
} from '../types';
import { getSegmentForScore } from './segment';

/**
 * Calcula la contribución (0–100) de una pregunta puntuable a partir de la
 * respuesta capturada. Las preguntas de categoría "meta" siempre devuelven `null`
 * porque no participan en el cálculo del Índice de Relevancia Empresarial.
 */
export function scoreForQuestion(question: FunnelQuestion, answers: QuestionAnswers): number | null {
  if (question.category === 'meta') return null;

  const raw = answers[question.id];
  if (raw === undefined || raw === null) return null;

  switch (question.kind) {
    case 'single-select': {
      const option = question.options.find((opt) => opt.value === raw);
      return option ? option.score : null;
    }
    case 'likert': {
      const value = Number(raw);
      if (Number.isNaN(value)) return null;
      return clamp(question.scoreFromValue(value), 0, 100);
    }
    case 'boolean': {
      return raw === true ? question.trueScore : question.falseScore;
    }
    case 'text':
      return null;
    default:
      return null;
  }
}

/**
 * Agrupa las contribuciones por categoría, aplica los pesos y produce el
 * resultado final del diagnóstico (puntuación total + desglose + segmento).
 */
export function calculateScoreResult(
  answers: QuestionAnswers,
  questions: FunnelQuestion[],
  categoryWeights: CategoryWeight[],
): ScoreResult {
  const scoresByCategory = new Map<CategoryKey, number[]>();

  for (const question of questions) {
    const score = scoreForQuestion(question, answers);
    if (score === null || question.category === 'meta') continue;

    const bucket = scoresByCategory.get(question.category) ?? [];
    bucket.push(score);
    scoresByCategory.set(question.category, bucket);
  }

  const categoryScores: CategoryScore[] = categoryWeights.map((cat) => {
    const bucket = scoresByCategory.get(cat.key) ?? [];
    const average = bucket.length > 0 ? bucket.reduce((sum, v) => sum + v, 0) / bucket.length : 0;
    const roundedScore = Math.round(average);
    return {
      key: cat.key,
      label: cat.label,
      score: roundedScore,
      weight: cat.weight,
      weightedContribution: roundedScore * cat.weight,
    };
  });

  const total = Math.round(categoryScores.reduce((sum, c) => sum + c.weightedContribution, 0));
  const clampedTotal = clamp(total, 0, 100);

  return {
    total: clampedTotal,
    segment: getSegmentForScore(clampedTotal),
    categoryScores,
    computedAt: new Date().toISOString(),
  };
}

/** Determina si todas las preguntas requeridas de una lista ya tienen respuesta. */
export function areRequiredQuestionsAnswered(
  questions: FunnelQuestion[],
  answers: QuestionAnswers,
): boolean {
  return questions
    .filter((q) => q.required)
    .every((q) => {
      const value = answers[q.id];
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== undefined && value !== null;
    });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
