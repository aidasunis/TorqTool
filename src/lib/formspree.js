// Sends a reservation to Formspree so it actually reaches an inbox — without this, the
// "te vamos a escribir" promise in the thank-you screen would be false (data only ever
// sat in the visitor's own localStorage). Set VITE_FORMSPREE_ENDPOINT in .env (see
// .env.example) with the endpoint your own Formspree form gives you.

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

export const isFormspreeConfigured = Boolean(ENDPOINT) && !ENDPOINT.includes('tu_id_aqui')

/** Returns { ok, skipped } — skipped=true means no endpoint is configured yet (dev/demo mode). */
export async function submitToFormspree(data) {
  if (!isFormspreeConfigured) return { ok: false, skipped: true }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    return { ok: res.ok, skipped: false }
  } catch {
    return { ok: false, skipped: false }
  }
}
