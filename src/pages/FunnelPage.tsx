import type { ReactNode } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';

/** Cascarón compartido por las cuatro páginas del embudo (header + footer + ancho de contenido). */
export function FunnelPage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <Header />
      <main className="flex-1">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  );
}
