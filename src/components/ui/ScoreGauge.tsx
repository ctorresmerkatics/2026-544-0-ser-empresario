interface ScoreGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  accentClassName?: string;
}

/**
 * Medidor circular 0–100. Si `value` cambia progresivamente (por ejemplo,
 * alimentado por `useCountUp`), el relleno se anima suavemente vía transición CSS.
 */
export function ScoreGauge({
  value,
  size = 176,
  strokeWidth = 14,
  accentClassName = 'text-brand-gold',
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-brand-navy/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`fill-none transition-[stroke-dashoffset] duration-300 ease-out ${accentClassName}`}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-brand-navy">{Math.round(clamped)}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink/50">/ 100</span>
      </div>
    </div>
  );
}
