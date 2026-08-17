import { useId } from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  rows?: number;
  hideLabel?: boolean;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  error,
  rows = 4,
  hideLabel = false,
}: TextAreaProps) {
  const fieldId = useId();

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={fieldId} className={hideLabel ? 'sr-only' : 'text-sm font-semibold text-brand-navy'}>
          {label || 'Campo de texto'}
        </label>
        {maxLength && (
          <span className="text-xs text-brand-ink/40">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-brand-ink placeholder:text-brand-ink/35
          transition-colors focus:outline-none focus:ring-4
          ${
            error
              ? 'border-red-400 focus:ring-red-100'
              : 'border-brand-navy/15 focus:border-brand-navy focus:ring-brand-navy/10'
          }`}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
