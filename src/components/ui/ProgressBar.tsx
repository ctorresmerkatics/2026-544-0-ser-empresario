interface ProgressBarProps {
  value: number;
  label?: string;
  helperText?: string;
}

export function ProgressBar({ value, label, helperText }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || helperText) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-semibold text-brand-navy">{label}</span>}
          {helperText && <span className="text-brand-ink/50">{helperText}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-brand-navy/10"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-navy transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
