import { EDITION_CONFIG } from '../../data/siteConfig';
import { Container } from './Container';

export function Header() {
  return (
    <header className="border-b border-brand-navy/10 bg-white/70 py-4 backdrop-blur">
      <Container className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy font-serif text-base font-bold text-brand-gold">
            SE
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-navy">Ser Empresario</p>
            <p className="text-xs text-brand-ink/50">{EDITION_CONFIG.ciudad}</p>
          </div>
        </div>
        <p className="hidden text-xs font-medium text-brand-ink/50 sm:block">
          {EDITION_CONFIG.cuposDisponibles} de {EDITION_CONFIG.cuposTotales} lugares disponibles para esta
          edición
        </p>
      </Container>
    </header>
  );
}
