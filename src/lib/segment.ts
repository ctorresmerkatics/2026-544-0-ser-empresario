import type { SegmentContent } from '../types';
import { SEGMENTS } from '../data/segments';

/**
 * Encuentra el segmento cuyo rango [minScore, maxScore] contiene la puntuación dada.
 * Si por algún motivo no hay coincidencia (no debería ocurrir con rangos 0–100
 * completos), se devuelve el segmento de menor puntuación como respaldo seguro.
 */
export function getSegmentForScore(total: number): SegmentContent {
  const match = SEGMENTS.find((segment) => total >= segment.minScore && total <= segment.maxScore);
  return match ?? SEGMENTS[SEGMENTS.length - 1];
}
