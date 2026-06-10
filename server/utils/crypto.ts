const encoder = new TextEncoder()
const pbkdf2Iterations = 100000

const toBase64Url = (input: ArrayBuffer | Uint8Array) => {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

const fromBase64Url = (input: string) => {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits'
  ])
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: pbkdf2Iterations
    },
    key,
    256
  )

  return `pbkdf2.${toBase64Url(salt)}.${toBase64Url(derived)}`
}

export const verifyPassword = async (password: string, storedHash: string) => {
  const [, saltValue, hashValue] = storedHash.split('.')

  if (!saltValue || !hashValue) return false

  const salt = fromBase64Url(saltValue)
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits'
  ])
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: pbkdf2Iterations
    },
    key,
    256
  )

  return toBase64Url(derived) === hashValue
}

export const signValue = async (payload: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))

  return toBase64Url(signature)
}

export const encodePayload = (payload: unknown) =>
  toBase64Url(encoder.encode(JSON.stringify(payload)))

export const decodePayload = <T>(payload: string): T => {
  const decoder = new TextDecoder()
  return JSON.parse(decoder.decode(fromBase64Url(payload))) as T
}
