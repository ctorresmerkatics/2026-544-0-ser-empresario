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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {

    setLoading(true);
    setError(null);

    const request: InterviewRequest = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      contact: state.contact,
      scoreTotal,
      segmentId,
      preferredSlot,
      notes,
    };
    //dispatch({ type: 'SUBMIT_INTERVIEW_REQUEST', request });
    //setSubmitted(true);

    // Construimos el HTML o resumen que recibirá el backend
    const respuestasHtml = `
      <ul>       
        <li><strong>Disponibilidad preferida:</strong> ${preferredSlot}</li>
        <li><strong>Notas adicionales:</strong> ${notes || 'Sin notas adicionales'}</li>
      </ul>
    `;

    try {

      const isLocalhost = window.location.hostname === 'localhost';
      const apiUrl = isLocalhost ? 'http://localhost:3001/enviar-aplicacion-cita' : '/api/enviar-aplicacion-cita';  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.contact.email,
          nombre: state.contact.nombre,
          preferredSlot,
          notes,
          scoreTotal,
          segmentId,
          respuestasHtml,
        }),
      });

      if (!response.ok) {
        throw new Error('Ocurrió un error al enviar el correo');
      }

      dispatch({ type: 'SUBMIT_INTERVIEW_REQUEST', request });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setSubmitted(false);
      setError(null);
    }, 300);
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button size="lg" onClick={handleSubmit} disabled={loading} className="mt-2">
            {loading ? 'Enviando...' : 'Confirmar solicitud'}
          </Button>
        </div>
      )}
    </Modal>
  );
}
