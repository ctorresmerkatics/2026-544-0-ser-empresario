import { useState } from 'react';
import { useFunnelContext } from '../../context/FunnelContext';
import type { InterviewRequest, SegmentId } from '../../types';
import { Button, Modal, TextArea } from '../ui';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  segmentId: SegmentId;
  scoreTotal: number;
  ctaLabel: string;
}

const SLOT_OPTIONS = [
  'Esta semana, en la mañana',
  'Esta semana, en la tarde',
  'La próxima semana',
  'Prefiero que me contacten para coordinar',
];

export function InterviewModal({ isOpen, onClose, segmentId, scoreTotal, ctaLabel }: InterviewModalProps) {
  const { state, dispatch } = useFunnelContext();
  const [preferredSlot, setPreferredSlot] = useState(SLOT_OPTIONS[0]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const request: InterviewRequest = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      contact: state.contact,
      scoreTotal,
      segmentId,
      preferredSlot,
      notes,
    };
    dispatch({ type: 'SUBMIT_INTERVIEW_REQUEST', request });
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    // Deja el formulario limpio la próxima vez que se abra, sin perder la solicitud ya enviada.
    window.setTimeout(() => setSubmitted(false), 300);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={ctaLabel}>
      {submitted ? (
        <div className="animate-fadeIn text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
            ✓
          </div>
          <p className="mt-4 font-semibold text-brand-navy">¡Listo, {state.contact.nombre.split(' ')[0]}!</p>
          <p className="mt-1 text-sm text-brand-ink/60">
            Registramos tu solicitud. Nuestro equipo editorial te contactará por WhatsApp o correo para
            confirmar el horario de tu conversación.
          </p>
          <Button className="mt-6" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="text-sm text-brand-ink/60">
            Cuéntanos cuándo te queda mejor y compártenos cualquier detalle que debamos saber antes de la
            conversación.
          </p>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-navy">Disponibilidad</label>
            <div className="grid gap-2">
              {SLOT_OPTIONS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPreferredSlot(slot)}
                  aria-pressed={preferredSlot === slot}
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-colors
                    ${
                      preferredSlot === slot
                        ? 'border-brand-navy bg-brand-navy text-white'
                        : 'border-brand-navy/15 bg-white text-brand-ink hover:border-brand-navy/40'
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <TextArea
            label="¿Algo que debamos saber antes de platicar?"
            value={notes}
            onChange={setNotes}
            placeholder="Opcional"
            rows={3}
            maxLength={300}
          />

          <Button size="lg" onClick={handleSubmit} className="mt-2">
            Confirmar solicitud
          </Button>
        </div>
      )}
    </Modal>
  );
}
