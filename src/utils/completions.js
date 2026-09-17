// Registro de finalización del curso, guardado directamente en el
// repositorio de GitHub (archivo `data/completions.json`), para poder saber
// quién ya hizo la capacitación y a quién le falta.
//
// Como este sitio es estático (GitHub Pages, sin backend/base de datos), la
// única forma de "guardar" algo de forma centralizada es escribir un archivo
// en el propio repositorio usando la API de contenidos de GitHub. Para eso
// se necesita un token con permiso de escritura, que se inyecta en tiempo de
// compilación (no queda en el código fuente) a través de la variable de
// entorno VITE_GITHUB_WRITE_TOKEN — ver .github/workflows/deploy.yml.
//
// Aviso de seguridad (ya conversado y aprobado): al ser un sitio estático,
// ese token queda embebido en el JavaScript que se le entrega al navegador,
// así que cualquiera que abra las herramientas de desarrollador del
// navegador podría verlo. Por eso el token está *limitado únicamente* a este
// repositorio y solo con permiso de "Contents: Read and write" — no puede
// tocar ningún otro repositorio ni configuración de la cuenta.
//
// Si por cualquier motivo el guardado falla (sin internet, token vencido,
// etc.) NO se bloquea al usuario: simplemente no queda registrado ese
// intento y el error se registra en la consola. La certificación y el resto
// del curso funcionan igual.

const OWNER = 'logitrans-desarrollos';
const REPO = 'formaciones-2027';
const FILE_PATH = 'data/completions.json';
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

function getToken() {
  return import.meta.env.VITE_GITHUB_WRITE_TOKEN || '';
}

function b64EncodeUtf8(str) {
  // btoa no soporta UTF-8 directamente (tildes, ñ, etc.), por eso se pasa
  // primero por encodeURIComponent/decodeURIComponent.
  return btoa(unescape(encodeURIComponent(str)));
}

function b64DecodeUtf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

async function fetchCurrentFile(token) {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (res.status === 404) {
    // Todavía no existe el archivo: se crea desde cero.
    return { records: [], sha: null };
  }
  if (!res.ok) {
    throw new Error(`No se pudo leer ${FILE_PATH} (HTTP ${res.status})`);
  }
  const json = await res.json();
  let records = [];
  try {
    records = JSON.parse(b64DecodeUtf8(json.content.replace(/\n/g, '')));
    if (!Array.isArray(records)) records = [];
  } catch {
    records = [];
  }
  return { records, sha: json.sha };
}

async function putFile(token, records, sha, message) {
  const body = {
    message,
    content: b64EncodeUtf8(JSON.stringify(records, null, 2)),
    committer: {
      name: 'Formaciones 2027 (bot)',
      email: 'noreply@logitrans-desarrollos.github.io',
    },
  };
  if (sha) body.sha = sha;

  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res;
}

/**
 * Registra (o actualiza) la finalización de un curso por parte de un
 * participante. Se identifica por correo (normalizado en minúsculas y sin
 * espacios). Si ya existía un registro con ese correo y ese curso, se
 * actualiza (por ejemplo si repite el curso o mejora su puntaje); si no,
 * se agrega uno nuevo.
 *
 * No lanza errores hacia arriba: si algo falla, devuelve `{ ok: false }`
 * y deja el detalle en consola, para no bloquear la experiencia del curso.
 */
export async function reportCompletion({ courseId, userData, score }) {
  const token = getToken();
  if (!token) {
    console.warn('[completions] VITE_GITHUB_WRITE_TOKEN no está configurado; no se registra la finalización.');
    return { ok: false, reason: 'no-token' };
  }

  const correo = (userData?.correo || '').trim().toLowerCase();
  if (!correo) {
    console.warn('[completions] Falta correo en userData; no se registra la finalización.');
    return { ok: false, reason: 'no-correo' };
  }

  const entry = {
    correo,
    nombre: userData?.nombre || '',
    cedula: userData?.cedula || '',
    cargo: userData?.cargo || '',
    courseId,
    score: score ?? null,
    completedAt: new Date().toISOString(),
  };

  // Hasta 2 intentos: si otra persona escribió el archivo justo entre el GET
  // y el PUT (HTTP 409), se vuelve a leer y reintenta una vez.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { records, sha } = await fetchCurrentFile(token);
      const idx = records.findIndex((r) => r.correo === correo && r.courseId === courseId);
      if (idx >= 0) records[idx] = entry;
      else records.push(entry);

      const res = await putFile(
        token,
        records,
        sha,
        `Registro de finalización: ${entry.correo} (${courseId})`
      );

      if (res.ok) return { ok: true };
      if (res.status === 409 && attempt === 0) continue; // reintentar
      const text = await res.text().catch(() => '');
      console.error(`[completions] Error guardando finalización (HTTP ${res.status}):`, text);
      return { ok: false, reason: `http-${res.status}` };
    } catch (err) {
      console.error('[completions] Error guardando finalización:', err);
      return { ok: false, reason: 'exception' };
    }
  }
  return { ok: false, reason: 'conflict' };
}
