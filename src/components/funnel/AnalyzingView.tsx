import { useEffect, useState } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useCountUp } from '../../hooks/useCountUp';
import { calculateScoreResult } from '../../lib/scoring';
import { QUESTIONS, CATEGORY_WEIGHTS } from '../../data/questions';
import { ProgressBar } from '../ui';

const STATUS_MESSAGES = [
  'Leyendo tu trayectoria…',
  'Evaluando tu liderazgo…',
  'Midiendo tu impacto…',
  'Buscando qué te diferencia…',
  'Verificando el momento editorial…',
];

export function AnalyzingView() {
  const { state, dispatch } = useFunnelContext();
  const [statusIndex, setStatusIndex] = useState(0);

  // Ciclo de mensajes de estado mientras se "procesa" el diagnóstico.
  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 420);
    return () => window.clearInterval(id);
  }, []);

  const progress = useCountUp(100, {
    durationMs: 1900,
    intervalMs: 25,
    onComplete: () => {
      const result = calculateScoreResult(state.answers, QUESTIONS, CATEGORY_WEIGHTS);
      dispatch({ type: 'COMPLETE_ANALYSIS', result });
    },
  });

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-navy/5">
        <span className="text-3xl font-extrabold text-brand-navy">{progress}%</span>
      </div>

      <h2 className="mt-6 font-serif text-2xl font-bold text-brand-navy">Calculando tu Índice de Relevancia Empresarial</h2>
      <p className="mt-2 min-h-[1.5rem] text-brand-ink/60 animate-pulseSoft">{STATUS_MESSAGES[statusIndex]}</p>

      <div className="mt-8 w-full max-w-sm">
        <ProgressBar value={progress} />
      </div>
    </div>
  );
}
