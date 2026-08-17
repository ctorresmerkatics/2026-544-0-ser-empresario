import { FunnelProvider, useFunnelContext } from './context/FunnelContext';
import { LandingPage } from './pages/LandingPage';
import { QuizPage } from './pages/QuizPage';
import { AnalyzingPage } from './pages/AnalyzingPage';
import { ResultPage } from './pages/ResultPage';

/**
 * Enruta entre las cuatro páginas del embudo según `phase` del estado global.
 * No usamos una librería de rutas: el "paso actual" ya vive en el estado
 * (persistido en localStorage y reflejado en la URL), así que un simple
 * switch es suficiente y evita una dependencia adicional.
 */
function FunnelRouter() {
  const { state } = useFunnelContext();

  switch (state.phase) {
    case 'quiz':
      return <QuizPage />;
    case 'analyzing':
      return <AnalyzingPage />;
    case 'result':
      return state.result ? <ResultPage /> : <LandingPage />;
    case 'landing':
    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <FunnelProvider>
      <FunnelRouter />
    </FunnelProvider>
  );
}

export default App;
