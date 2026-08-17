/**
 * Envoltura mínima sobre `localStorage` con manejo de errores — evita que el
 * embudo se rompa en navegadores con almacenamiento deshabilitado (modo privado,
 * cuota excedida, etc.).
 */
export function readFromStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento no disponible: la app sigue funcionando, solo sin persistencia.
  }
}

export function clearStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}
