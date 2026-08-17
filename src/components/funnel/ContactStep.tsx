import type { ContactInfo, FormErrors } from '../../types';
import { TextField } from '../ui';

interface ContactStepProps {
  contact: ContactInfo;
  errors: FormErrors<keyof ContactInfo>;
  showValidation: boolean;
  onChange: (field: keyof ContactInfo, value: string) => void;
}

export function ContactStep({ contact, errors, showValidation, onChange }: ContactStepProps) {
  const errorFor = (field: keyof ContactInfo) => (showValidation ? errors[field] : undefined);

  return (
    <div className="animate-fadeIn">
      <h2 className="font-serif text-2xl font-bold leading-snug text-brand-navy sm:text-[1.75rem]">
        Por último, ¿cómo te contactamos?
      </h2>
      <p className="mt-2 text-brand-ink/60">
        Usamos estos datos únicamente para enviarte tu resultado y, si tu perfil califica, invitarte a la
        conversación editorial.
      </p>

      <div className="mt-6 grid gap-4">
        <TextField
          label="Nombre completo"
          value={contact.nombre}
          onChange={(value) => onChange('nombre', value)}
          error={errorFor('nombre')}
          placeholder="Ej. María Fernanda López"
        />
        <TextField
          label="Empresa u organización"
          value={contact.empresa}
          onChange={(value) => onChange('empresa', value)}
          placeholder="Opcional"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Correo electrónico"
            type="email"
            value={contact.email}
            onChange={(value) => onChange('email', value)}
            error={errorFor('email')}
            placeholder="tu@empresa.com"
          />
          <TextField
            label="Teléfono / WhatsApp"
            type="tel"
            value={contact.telefono}
            onChange={(value) => onChange('telefono', value)}
            error={errorFor('telefono')}
            placeholder="656 000 0000"
          />
        </div>
        <TextField
          label="Perfil de LinkedIn"
          value={contact.linkedin}
          onChange={(value) => onChange('linkedin', value)}
          error={errorFor('linkedin')}
          placeholder="linkedin.com/in/tu-perfil"
        />
      </div>
    </div>
  );
}
