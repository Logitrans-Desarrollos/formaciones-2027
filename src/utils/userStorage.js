// Guarda y recupera los datos del participante (nombre, cédula, cargo) para
// un curso específico. Se usa para: (1) no volver a pedir los datos si ya los
// diligenció antes, y (2) generar el certificado con su nombre real al final.

const STORAGE_PREFIX = 'formaciones2027_user_';

export function getUserData(courseId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + courseId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserData(courseId, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + courseId, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearUserData(courseId) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + courseId);
  } catch {
    /* noop */
  }
}

export function isUserDataComplete(data) {
  return !!(data && data.nombre && data.cedula && data.cargo);
}
