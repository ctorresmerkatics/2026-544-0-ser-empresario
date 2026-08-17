import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { FunnelAction, FunnelState, PersistedFunnelState } from '../types';
import { EMPTY_CONTACT, EMPTY_PREFERENCES } from '../types';
import { readFromStorage, writeToStorage } from '../lib/storage';
import { LOCAL_STORAGE_KEY, URL_STEP_PARAM } from '../data/siteConfig';

export const initialFunnelState: FunnelState = {
  phase: 'landing',
  stepIndex: 0,
  answers: {},
  contact: EMPTY_CONTACT,
  preferences: EMPTY_PREFERENCES,
  result: null,
  status: 'idle',
  error: null,
  interviewRequest: null,
};

function funnelReducer(state: FunnelState, action: FunnelAction): FunnelState {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, phase: 'quiz', stepIndex: 0, status: 'idle', error: null };

    case 'ANSWER_QUESTION':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };

    case 'UPDATE_CONTACT':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };

    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, [action.field]: action.value } };

    case 'GO_TO_STEP':
      return { ...state, stepIndex: action.stepIndex };

    case 'NEXT_STEP':
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, action.totalSteps - 1) };

    case 'PREV_STEP':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };

    case 'BEGIN_ANALYSIS':
      return { ...state, phase: 'analyzing', status: 'loading', error: null };

    case 'COMPLETE_ANALYSIS':
      return { ...state, phase: 'result', status: 'idle', result: action.result };

    case 'SUBMIT_INTERVIEW_REQUEST':
      return { ...state, interviewRequest: action.request };

    case 'RESET':
      return { ...initialFunnelState };

    case 'HYDRATE':
      return { ...state, ...action.state };

    default:
      return state;
  }
}

interface FunnelContextValue {
  state: FunnelState;
  dispatch: Dispatch<FunnelAction>;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

/**
 * Combina lo persistido en localStorage con el parámetro `?paso=` de la URL
 * para restaurar el progreso del usuario (ver requisito de persistencia).
 * La URL tiene prioridad cuando ambos están presentes, para que un enlace
 * compartido siempre lleve al paso indicado en él.
 */
function buildInitialState(): FunnelState {
  const persisted = readFromStorage<PersistedFunnelState>(LOCAL_STORAGE_KEY);
  let state: FunnelState = persisted ? { ...initialFunnelState, ...persisted } : initialFunnelState;

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get(URL_STEP_PARAM);
    if (stepParam) {
      const parsed = Number.parseInt(stepParam, 10);
      if (Number.isFinite(parsed) && parsed >= 1) {
        state = { ...state, phase: 'quiz', stepIndex: parsed - 1 };
      }
    }
  }

  return state;
}

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(funnelReducer, undefined, buildInitialState);

  // Persistir en localStorage ante cualquier cambio relevante del estado.
  useEffect(() => {
    const toPersist: PersistedFunnelState = {
      phase: state.phase,
      stepIndex: state.stepIndex,
      answers: state.answers,
      contact: state.contact,
      preferences: state.preferences,
      result: state.result,
      interviewRequest: state.interviewRequest,
    };
    writeToStorage(LOCAL_STORAGE_KEY, toPersist);
  }, [
    state.phase,
    state.stepIndex,
    state.answers,
    state.contact,
    state.preferences,
    state.result,
    state.interviewRequest,
  ]);

  // Reflejar el paso actual en la URL para permitir compartir/retomar el progreso.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (state.phase === 'quiz') {
      url.searchParams.set(URL_STEP_PARAM, String(state.stepIndex + 1));
    } else {
      url.searchParams.delete(URL_STEP_PARAM);
    }
    window.history.replaceState(null, '', url.toString());
  }, [state.phase, state.stepIndex]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
}

export function useFunnelContext(): FunnelContextValue {
  const ctx = useContext(FunnelContext);
  if (!ctx) {
    throw new Error('useFunnelContext debe usarse dentro de <FunnelProvider>.');
  }
  return ctx;
}
