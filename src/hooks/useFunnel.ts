import { useMemo } from 'react';
import { useFunnelContext } from '../context/FunnelContext';
import { QUESTIONS, TOTAL_QUIZ_STEPS } from '../data/questions';
import { areRequiredQuestionsAnswered } from '../lib/scoring';
import { validateContact } from '../lib/validators';
import type { FunnelQuestion } from '../types';

/** Índice de paso reservado para el formulario de contacto (siempre el último). */
export const CONTACT_STEP_INDEX = QUESTIONS.length;

/**
 * Hook de conveniencia que combina el estado global del embudo con datos
 * derivados que usan las vistas: la pregunta activa, si se puede avanzar,
 * y el progreso general. Mantiene los componentes de UI libres de lógica de negocio.
 */
export function useFunnel() {
  const { state, dispatch } = useFunnelContext();

  const currentQuestion: FunnelQuestion | null = useMemo(
    () => (state.stepIndex < QUESTIONS.length ? QUESTIONS[state.stepIndex] : null),
    [state.stepIndex],
  );

  const isContactStep = state.stepIndex === CONTACT_STEP_INDEX;

  const canAdvance = useMemo(() => {
    if (currentQuestion) {
      return areRequiredQuestionsAnswered([currentQuestion], state.answers);
    }
    if (isContactStep) {
      return Object.keys(validateContact(state.contact)).length === 0;
    }
    return true;
  }, [currentQuestion, isContactStep, state.answers, state.contact]);

  const progress = Math.round(((state.stepIndex + 1) / TOTAL_QUIZ_STEPS) * 100);

  return {
    state,
    dispatch,
    currentQuestion,
    isContactStep,
    canAdvance,
    progress,
    totalSteps: TOTAL_QUIZ_STEPS,
    isFirstStep: state.stepIndex === 0,
    isLastStep: state.stepIndex === TOTAL_QUIZ_STEPS - 1,
  };
}
