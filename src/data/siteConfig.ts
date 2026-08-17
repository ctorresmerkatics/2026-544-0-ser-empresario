import type { EditionConfig } from '../types';

/**
 * Configuración de la edición vigente. El cupo debe reflejar una decisión editorial
 * real (ver plan de embudo, sección 4: "la exclusividad debe ser real, nunca simulada").
 * Actualiza estos valores desde el equipo editorial antes de cada lanzamiento —
 * nunca inventes un número solo para generar urgencia.
 */
export const EDITION_CONFIG: EditionConfig = {
  edicionNombre: 'Selección Ser Empresario — Próxima edición',
  cuposTotales: 8,
  cuposDisponibles: 5,
  fechaLimiteISO: '2026-09-15',
  ciudad: 'Ciudad Juárez, Chihuahua',
};

export const LOCAL_STORAGE_KEY = 'ser-empresario:funnel-state:v1';
export const URL_STEP_PARAM = 'paso';
