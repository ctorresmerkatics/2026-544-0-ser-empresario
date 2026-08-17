import type { SegmentContent } from '../types';

/**
 * Los cuatro resultados del diagnóstico — ver plan de embudo, sección 9.
 * Ordenados de mayor a menor puntuación; `getSegmentForScore` en /lib/segment.ts
 * recorre este arreglo para encontrar el primero cuyo rango contiene la puntuación.
 */
export const SEGMENTS: SegmentContent[] = [
  {
    id: 'alto-potencial',
    minScore: 80,
    maxScore: 100,
    badge: 'Perfil con alto potencial editorial',
    title: 'Tu historia tiene potencial para convertirse en un activo de autoridad',
    message:
      'Tu trayectoria reúne elementos sólidos de liderazgo, impacto y relevancia. Consideramos que existe material para construir un perfil editorial con valor para la comunidad empresarial.',
    ctaLabel: 'Solicitar entrevista editorial',
    offersInterview: true,
    accentBg: 'bg-brand-gold/10',
    accentText: 'text-brand-gold',
    accentRing: 'ring-brand-gold/30',
  },
  {
    id: 'consolidacion',
    minScore: 60,
    maxScore: 79,
    badge: 'Historia empresarial en consolidación',
    title: 'Tu historia cuenta con elementos valiosos',
    message:
      'Una sesión de descubrimiento nos permitirá identificar el ángulo editorial que mejor representa tu trayectoria. No se trata de un rechazo: se trata de encontrar el enfoque correcto.',
    ctaLabel: 'Descubrir el ángulo de mi historia',
    offersInterview: true,
    accentBg: 'bg-brand-navy/10',
    accentText: 'text-brand-navy',
    accentRing: 'ring-brand-navy/30',
  },
  {
    id: 'posicionamiento',
    minScore: 40,
    maxScore: 59,
    badge: 'Marca con oportunidad de posicionamiento',
    title: 'Tu marca tiene otras rutas de posicionamiento con Ser Empresario',
    message:
      'Tu perfil quizá no tenga todavía una historia personal lo bastante desarrollada para un perfil editorial completo, pero puedes explorar otros formatos: contenido patrocinado, reportaje empresarial, entrevista temática, cobertura de lanzamiento, podcast o publicación digital.',
    ctaLabel: 'Conocer opciones de posicionamiento',
    offersInterview: false,
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-700',
    accentRing: 'ring-amber-500/30',
  },
  {
    id: 'comunidad',
    minScore: 0,
    maxScore: 39,
    badge: 'Comunidad Ser Empresario',
    title: 'Gracias por compartir tu trayectoria con nosotros',
    message:
      'Hoy tu perfil no encaja con los criterios de esta edición, pero eso puede cambiar. Te invitamos a nuestro boletín, eventos y contenidos, y a repetir la evaluación más adelante — no perdemos el contacto contigo.',
    ctaLabel: 'Unirme a la comunidad Ser Empresario',
    offersInterview: false,
    accentBg: 'bg-slate-500/10',
    accentText: 'text-slate-600',
    accentRing: 'ring-slate-400/30',
  },
];
