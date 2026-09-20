// Capa muy simple de "innovation accounting" (Eric Ries, cap. 7) para esta landing de validación.
// Todo se guarda en localStorage: sirve para la demo de clase / pruebas locales.
// Para producción real, reemplaza `persist()` por una llamada a tu backend
// (Formspree, Google Sheets vía Apps Script, Airtable, Supabase, etc.).

const VISITS_KEY = 'torq_mvp_visits'
const SUBMISSIONS_KEY = 'torq_mvp_submissions'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage puede fallar (modo privado, storage lleno, etc.) — no rompemos la página por esto.
  }
}

/** Cuenta una visita a la landing. Métrica base para calcular la tasa de conversión. */
export function trackVisit() {
  const visits = readJSON(VISITS_KEY, 0) + 1
  writeJSON(VISITS_KEY, visits)
  return visits
}

export function getVisits() {
  return readJSON(VISITS_KEY, 0)
}

/**
 * Guarda una respuesta del formulario de validación.
 * shape: { nombre, contacto, rol, metodoActual, depositoDispuesto, montoDeposito, canal, timestamp }
 */
export function addSubmission(data) {
  const submissions = readJSON(SUBMISSIONS_KEY, [])
  const entry = { ...data, timestamp: new Date().toISOString() }
  submissions.push(entry)
  writeJSON(SUBMISSIONS_KEY, submissions)
  return submissions
}

export function getSubmissions() {
  return readJSON(SUBMISSIONS_KEY, [])
}

/**
 * Calcula las 3 métricas de validación definidas para TORQ:
 * 1. Tasa de conversión visitante -> reserva (hipótesis de valor)
 * 2. % dispuesto a pagar depósito (hipótesis de precio / intención real de compra)
 * 3. Canal de adquisición dominante (hipótesis de crecimiento)
 */
export function computeMetrics() {
  const visits = getVisits()
  const submissions = getSubmissions()
  const total = submissions.length

  const conversionRate = visits > 0 ? total / visits : 0

  const dispuestos = submissions.filter((s) => s.depositoDispuesto === 'si').length
  const depositoRate = total > 0 ? dispuestos / total : 0

  const channelCounts = submissions.reduce((acc, s) => {
    const canal = s.canal || 'Otro'
    acc[canal] = (acc[canal] || 0) + 1
    return acc
  }, {})

  const channelBreakdown = Object.entries(channelCounts)
    .map(([canal, count]) => ({ canal, count, share: total > 0 ? count / total : 0 }))
    .sort((a, b) => b.count - a.count)

  return {
    visits,
    total,
    conversionRate,
    dispuestos,
    depositoRate,
    channelBreakdown,
    topChannel: channelBreakdown[0]?.canal ?? '—',
  }
}
