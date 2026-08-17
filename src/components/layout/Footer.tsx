import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-brand-navy/10 py-8">
      <Container className="flex flex-col items-center gap-2 text-center text-xs text-brand-ink/45">
        <p>
          Selección Ser Empresario — Historias que dejan huella. Los criterios de selección de cada edición
          son públicos y consistentes.
        </p>
        <p>Tus datos se usan únicamente para evaluar tu perfil y, si aplica, contactarte sobre tu resultado.</p>
      </Container>
    </footer>
  );
}
