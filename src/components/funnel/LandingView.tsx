import { useFunnelContext } from '../../context/FunnelContext';
import { EDITION_CONFIG } from '../../data/siteConfig';
import { Button, Badge } from '../ui';

const TRUST_POINTS = [
  '+25 años de trayectoria editorial en Ciudad Juárez y Chihuahua',
  'Revista impresa mensual, edición digital y podcast',
  'Cobertura empresarial, económica y de liderazgo regional',
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Evalúa tu perfil', text: 'Responde un diagnóstico breve de 4 minutos.' },
  { step: '2', title: 'Recibe tu resultado', text: 'Conoce tu Índice de Relevancia Empresarial al instante.' },
  { step: '3', title: 'Conversación editorial', text: 'Si calificas, te invitamos a contar tu historia.' },
];

export function LandingView() {
  const { dispatch } = useFunnelContext();

  return (
    <div className="py-10 sm:py-16">
      <div className="text-center">
        <Badge className="bg-brand-gold/10 text-brand-gold">
          {EDITION_CONFIG.edicionNombre}
        </Badge>

        <h1 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-bold leading-[1.1] text-brand-navy sm:text-5xl">
          ¿Tu historia merece ser publicada?
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-brand-ink/70">
          Descubre si tu trayectoria, liderazgo e impacto pueden formar parte de la próxima edición de{' '}
          <span className="font-semibold text-brand-navy">Ser Empresario</span>.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button size="lg" onClick={() => dispatch({ type: 'START_QUIZ' })}>
            Evaluar mi perfil
          </Button>
          <p className="text-sm text-brand-ink/45">
            Toma ~4 minutos · {EDITION_CONFIG.cuposDisponibles} de {EDITION_CONFIG.cuposTotales} lugares
            disponibles para esta edición
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-2xl gap-3 sm:grid-cols-3">
        {HOW_IT_WORKS.map((item) => (
          <div key={item.step} className="rounded-2xl border border-brand-navy/10 bg-white/70 p-5 text-left">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
              {item.step}
            </span>
            <p className="mt-3 font-semibold text-brand-navy">{item.title}</p>
            <p className="mt-1 text-sm text-brand-ink/60">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-brand-navy/10 bg-brand-navy/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-navy/70">Sobre Ser Empresario</p>
        <ul className="mt-3 grid gap-2">
          {TRUST_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-brand-ink/70">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-gold" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
