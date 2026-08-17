interface SelectableCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export function SelectableCard({ label, description, selected, onSelect }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-150
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-navy/20
        ${
          selected
            ? 'border-brand-navy bg-brand-navy text-white shadow-card'
            : 'border-brand-navy/15 bg-white hover:border-brand-navy/40 hover:shadow-card'
        }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors
          ${selected ? 'border-brand-gold bg-brand-gold' : 'border-brand-navy/30 bg-transparent'}`}
      >
        {selected && (
          <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3 text-white">
            <path
              d="M4 10.5 8 14.5 16 5.5"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>
        <span className={`block font-semibold ${selected ? 'text-white' : 'text-brand-ink'}`}>{label}</span>
        {description && (
          <span className={`mt-0.5 block text-sm ${selected ? 'text-white/80' : 'text-brand-ink/60'}`}>
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
