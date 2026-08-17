import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  durationMs?: number;
  intervalMs?: number;
  onComplete?: () => void;
}

/**
 * Anima un contador de 0 hasta `target` usando `setInterval` (requisito de
 * interactividad con temporizadores). Se usa en la pantalla de análisis para
 * simular el procesamiento del diagnóstico antes de mostrar el resultado.
 */
export function useCountUp(target: number, options: UseCountUpOptions = {}): number {
  const { durationMs = 1800, intervalMs = 30, onComplete } = options;
  const [value, setValue] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setValue(0);
    const totalTicks = Math.max(1, Math.round(durationMs / intervalMs));
    let tick = 0;

    const id = window.setInterval(() => {
      tick += 1;
      const ratio = Math.min(tick / totalTicks, 1);
      setValue(Math.round(ratio * target));

      if (tick >= totalTicks) {
        window.clearInterval(id);
        onCompleteRef.current?.();
      }
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [target, durationMs, intervalMs]);

  return value;
}
