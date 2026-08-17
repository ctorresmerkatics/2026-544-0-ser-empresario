import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-navy text-white hover:bg-brand-navyLight focus-visible:ring-brand-navy/40 shadow-card',
  secondary:
    'bg-brand-gold text-white hover:brightness-110 focus-visible:ring-brand-gold/40 shadow-card',
  outline:
    'bg-transparent text-brand-navy border border-brand-navy/30 hover:bg-brand-navy/5 focus-visible:ring-brand-navy/30',
  ghost: 'bg-transparent text-brand-navy hover:bg-brand-navy/5 focus-visible:ring-brand-navy/20',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-4
        disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
