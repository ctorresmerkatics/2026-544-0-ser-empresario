import { useState } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import { useCountUp } from '../../hooks/useCountUp';
import { Badge, Button, ProgressBar, ScoreGauge } from '../ui';
import { InterviewModal } from './InterviewModal';

const ALTERNATIVE_PRODUCTS = [
  'Contenido patrocinado',
  'Reportaje empresarial',
  'Entrevista temática',
  'Cobertura de lanzamiento',
  'Podcast o video',
  'Publicación digital',
];

export function ResultView() {
  const { state, dispatch } = useFunnelContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const result = state.result;
  const animatedTotal = useCountUp(result?.total ?? 0, { durationMs: 900, intervalMs: 20 });

  if (!result) return null;

  const { segment, categoryScores } = result;
  const firstName = state.contact.nombre.split(' ')[0] || 'ahí';
  

  return (
    <div className="py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-brand-navy/10 bg-white/70 p-6 text-center shadow-card sm:p-10">
        <Badge className={`${segment.accentBg} ${segment.accentText}`}>{segment.badge}</Badge>

        <div className="mt-6 flex justify-center">
          <ScoreGauge value={animatedTotal} accentClassName={segment.accentText} />
        </div>

        <h1 className="mt-6 font-serif text-2xl font-bold text-brand-navy sm:text-3xl">{segment.title}</h1>
        <p className="mt-3 text-brand-ink/70">
          Hola {firstName}, {segment.message}
        </p>

        <div className="mt-8 grid gap-3 text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-navy/60">
            Desglose por categoría
          </p>
          {categoryScores.map((category) => (
            <ProgressBar
              key={category.key}
              value={category.score}
              label={category.label}
              helperText={`${Math.round(category.weight * 100)}% del índice`}
            />
          ))}
        </div>

        {segment.id === 'posicionamiento' && (
          <div className="mt-8 grid gap-2 text-left sm:grid-cols-2">
            {ALTERNATIVE_PRODUCTS.map((product) => (
              <div
                key={product}
                className="rounded-xl border border-brand-navy/10 bg-brand-navy/5 px-4 py-2.5 text-sm font-medium text-brand-navy"
              >
                {product}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          {segment.offersInterview && (
            <Button size="lg" onClick={() => setIsModalOpen(true)}>
              {segment.ctaLabel}
            </Button>
          )}

          {segment.id === 'posicionamiento' && (
            <Button size="lg" variant="secondary">
              {segment.ctaLabel}
            </Button>
          )}

          {segment.id === 'comunidad' && (
            <Button size="lg" variant="secondary" onClick={() => setSubscribed(true)} disabled={subscribed}>
              {subscribed ? 'Ya formas parte de la comunidad' : segment.ctaLabel}
            </Button>
          )}

          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET' })}
            className="text-sm font-medium text-brand-ink/45 underline-offset-2 hover:text-brand-ink/70 hover:underline"
          >
            Volver a evaluar mi perfil
          </button>
        </div>
      </div>

      {segment.offersInterview && (
        <InterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          segmentId={segment.id}
          scoreTotal={result.total}
          ctaLabel={segment.ctaLabel}
        />
      )}
    </div>
  );
}
