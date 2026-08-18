import { CATEGORY_WEIGHTS, QUESTIONS } from '../data/questions';
import { SEGMENTS } from '../data/segments';
import type { CategoryScore, SegmentContent } from '../types';


export interface FunnelResult {
  total: number;
  segment: SegmentContent;
  categoryScores: CategoryScore[];
  computedAt: string;
}

/**
 * Encuentra el segmento cuyo rango [minScore, maxScore] contiene la puntuación dada.
 * Si por algún motivo no hay coincidencia (no debería ocurrir con rangos 0–100
 * completos), se devuelve el segmento de menor puntuación como respaldo seguro.
 */
export function getSegmentForScore(total: number): SegmentContent {
  const match = SEGMENTS.find((segment) => total >= segment.minScore && total <= segment.maxScore);
  return match ?? SEGMENTS[SEGMENTS.length - 1];
}

// Inclinamos el tipo de retorno implícitamente o definimos la estructura directamente
export function evaluateFunnel(answers: Record<string, any>): FunnelResult {
  // Mapeamos indicando explícitamente el tipo de retorno (: CategoryScore) en cada iteración
  const categoryScores: CategoryScore[] = CATEGORY_WEIGHTS.map((cat): CategoryScore => {
    const categoryQuestions = QUESTIONS.filter((q) => q.category === cat.key);

    if (categoryQuestions.length === 0) {
      return {
        key: cat.key,
        label: cat.label,
        score: 0,
        weight: cat.weight,
      } as CategoryScore; // "as CategoryScore" asegura la compatibilidad exacta
    }

    let categoryTotalScore = 0;
    let answeredCount = 0;

    categoryQuestions.forEach((q) => {
      const val = answers[q.id];
      if (val === undefined || val === null || val === '') return;

      answeredCount++;

      if (q.kind === 'single-select') {
        const selectedOption = q.options.find((opt) => opt.value === val);
        if (selectedOption) {
          categoryTotalScore += selectedOption.score;
        }
      } else if (q.kind === 'boolean') {
        categoryTotalScore += val ? q.trueScore : q.falseScore;
      } else if (q.kind === 'likert' && typeof val === 'number') {
        categoryTotalScore += q.scoreFromValue(val);
      }
    });

    const avgCategoryScore = answeredCount > 0 ? categoryTotalScore / answeredCount : 0;

    return {
      key: cat.key,
      label: cat.label,
      score: Math.round(avgCategoryScore),
      weight: cat.weight,
    } as CategoryScore;
  });

  const rawTotal = categoryScores.reduce((acc, cat) => acc + cat.score * cat.weight, 0);
  const total = Math.min(100, Math.max(0, Math.round(rawTotal)));
  const segment = getSegmentForScore(total);

  return {
    total,
    segment,
    categoryScores,
    computedAt: new Date().toISOString(),
  };
}