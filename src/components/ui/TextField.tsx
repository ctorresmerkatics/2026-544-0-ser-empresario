import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hideLabel?: boolean;
}

export function TextField({ label, value, onChange, error, id, hideLabel = false, ...rest }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={hideLabel ? 'sr-only' : 'mb-1.5 block text-sm font-semibold text-brand-navy'}
      >
        {label || 'Campo de texto'}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-brand-ink placeholder:text-brand-ink/35
          transition-colors focus:outline-none focus:ring-4
          ${
            error
              ? 'border-red-400 focus:ring-red-100'
              : 'border-brand-navy/15 focus:border-brand-navy focus:ring-brand-navy/10'
          }`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
