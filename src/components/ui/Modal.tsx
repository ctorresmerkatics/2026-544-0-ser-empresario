import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-brand-navy/50 backdrop-blur-sm animate-fadeIn"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-lg animate-scaleIn rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-serif text-xl font-bold text-brand-navy sm:text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-brand-ink/50 transition-colors hover:bg-brand-navy/5 hover:text-brand-ink"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
