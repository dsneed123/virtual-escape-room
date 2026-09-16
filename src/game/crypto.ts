// Answers are never stored in plain text. This is not real cryptography — it only
// stops a curious player from reading the solutions out of the bundle.
const SALT = 'mrdn/7f2'
const MASK = 'meridian'

export const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')

export function digest(input: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  const s = SALT + input
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

export const matches = (input: string, hash: string) => digest(norm(input)) === hash

/** Reveal an obfuscated string (used for fragment words, only after a solve). */
export function rv(payload: string): string {
  const raw = atob(payload)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i) ^ MASK.charCodeAt(i % MASK.length)
  }
  return new TextDecoder().decode(bytes)
}

/** Vigenère — the in-fiction "Vance machine". Letters only, spaces discarded. */
export function vigenere(text: string, key: string, decode = true): string {
  const t = text.toUpperCase().replace(/[^A-Z]/g, '')
  const k = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (!k) return t
  let out = ''
  for (let i = 0; i < t.length; i++) {
    const shift = k.charCodeAt(i % k.length) - 65
    const c = t.charCodeAt(i) - 65
    out += String.fromCharCode(((c + (decode ? -shift : shift) + 26) % 26) + 65)
  }
  return out
}

export const group = (s: string, n = 5) => (s.match(new RegExp(`.{1,${n}}`, 'g')) ?? []).join(' ')
