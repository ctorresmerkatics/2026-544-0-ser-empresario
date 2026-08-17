import type { ContactInfo, FormErrors } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Acepta números con espacios, guiones, paréntesis y prefijo +; exige 10–15 dígitos.
const PHONE_DIGITS_REGEX = /\d/g;

export function validateContact(contact: ContactInfo): FormErrors<keyof ContactInfo> {
  const errors: FormErrors<keyof ContactInfo> = {};

  if (!contact.nombre.trim()) {
    errors.nombre = 'Cuéntanos tu nombre completo.';
  }

  if (!contact.email.trim()) {
    errors.email = 'Necesitamos un correo para enviarte tu resultado.';
  } else if (!EMAIL_REGEX.test(contact.email.trim())) {
    errors.email = 'Revisa el formato del correo.';
  }

  const digits = contact.telefono.match(PHONE_DIGITS_REGEX)?.length ?? 0;
  if (!contact.telefono.trim()) {
    errors.telefono = 'Déjanos un teléfono de contacto.';
  } else if (digits < 10) {
    errors.telefono = 'Incluye un teléfono a 10 dígitos.';
  }

  if (!contact.linkedin.trim()) {
    errors.linkedin = 'Comparte el enlace a tu perfil de LinkedIn.';
  }

  return errors;
}

export function hasErrors(errors: FormErrors<string>): boolean {
  return Object.keys(errors).length > 0;
}
