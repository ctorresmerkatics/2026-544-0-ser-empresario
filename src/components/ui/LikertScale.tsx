import type { CSSProperties } from 'react';

interface LikertScaleProps {
  value: number | null;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

export function LikertScale({ value, min, max, step, minLabel, maxLabel, onChange }: LikertScaleProps) {
  const current = value ?? Math.round((min + max) / 2);
  const fillPercent = ((current - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <input
        type="range"
        className="likert-slider w-full"
        style={{ '--fill': `${fillPercent}%` } as CSSProperties}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={String(current)}
      />
      <div className="mt-3 flex items-center justify-between text-sm text-brand-ink/60">
        <span>{minLabel}</span>
        <span className="rounded-full bg-brand-navy px-3 py-1 text-sm font-semibold text-white">
          {current} / {max}
        </span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
