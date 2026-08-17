import { useEffect, useState } from 'react';
import { useFunnel } from '../../hooks/useFunnel';
import { validateContact } from '../../lib/validators';
import { Button, ProgressBar } from '../ui';
import { QuestionRenderer } from './QuestionRenderer';
import { ContactStep } from './ContactStep';
import type { ContactInfo } from '../../types';

export function QuizView() {
  const { state, dispatch, currentQuestion, isContactStep, canAdvance, progress, totalSteps, isFirstStep } =
    useFunnel();
  const [showValidation, setShowValidation] = useState(false);

  // Cada vez que cambia el paso, ocultamos los mensajes de validación del paso anterior.
  useEffect(() => {
    setShowValidation(false);
  }, [state.stepIndex]);

  const contactErrors = validateContact(state.contact);

  function handleBack() {
    if (isFirstStep) {
      dispatch({ type: 'HYDRATE', state: { phase: 'landing' } });
      return;
    }
    dispatch({ type: 'PREV_STEP' });
  }

  function handleNext() {
    if (!canAdvance) {
      setShowValidation(true);
      return;
    }
    if (isContactStep) {
      dispatch({ type: 'BEGIN_ANALYSIS' });
      return;
    }
    dispatch({ type: 'NEXT_STEP', totalSteps });
  }

  function handleContactChange(field: keyof ContactInfo, value: string) {
    dispatch({ type: 'UPDATE_CONTACT', field, value });
  }

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-10">
      <div className="mb-8">
        <ProgressBar
          value={progress}
          label={`Paso ${state.stepIndex + 1} de ${totalSteps}`}
          helperText="Índice de Relevancia Empresarial"
        />
      </div>

      <div className="rounded-3xl border border-brand-navy/10 bg-white/70 p-6 shadow-card sm:p-10">
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            value={state.answers[currentQuestion.id]}
            onChange={(value) => dispatch({ type: 'ANSWER_QUESTION', questionId: currentQuestion.id, value })}
            showValidation={showValidation}
          />
        )}

        {isContactStep && (
          <ContactStep
            contact={state.contact}
            errors={contactErrors}
            showValidation={showValidation}
            onChange={handleContactChange}
          />
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={handleBack}>
            ← Atrás
          </Button>
          <Button variant="primary" size="lg" onClick={handleNext}>
            {isContactStep ? 'Ver mi resultado' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
