import type { H3Event } from 'h3'
import type { AppUser } from '~/types/knowledge'

interface SessionPayload {
  userId: number
  exp: number
}

interface UserRow {
  id: number
  name: string
  email: string
}

const cookieName = 'knowledge_session'
const maxAge = 60 * 60 * 24 * 14

const getSessionSecret = (event: H3Event) => {
  const env = (event.context as { cloudflare?: { env?: { SESSION_SECRET?: string } } }).cloudflare
    ?.env
  return env?.SESSION_SECRET || 'dev-only-change-this-secret'
}

export const createSession = async (event: H3Event, userId: number) => {
  const payload = encodePayload({
    userId,
    exp: Math.floor(Date.now() / 1000) + maxAge
  })
  const signature = await signValue(payload, getSessionSecret(event))

  setCookie(event, cookieName, `${payload}.${signature}`, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax',
    secure: getRequestURL(event).protocol === 'https:'
  })
}

export const clearAuthSession = (event: H3Event) => {
  deleteCookie(event, cookieName, { path: '/' })
}

export const getCurrentUser = async (event: H3Event): Promise<AppUser | null> => {
  const session = getCookie(event, cookieName)
  if (!session) return null

  const [payload, signature] = session.split('.')
  if (!payload || !signature) return null

  const expectedSignature = await signValue(payload, getSessionSecret(event))
  if (signature !== expectedSignature) return null

  const data = decodePayload<SessionPayload>(payload)
  if (data.exp < Math.floor(Date.now() / 1000)) return null

  const db = useDb(event)
  const user = await db
    .prepare('SELECT id, name, email FROM users WHERE id = ?')
    .bind(data.userId)
    .first<UserRow>()

  return user ? { id: user.id, name: user.name, email: user.email } : null
}

export const requireUser = async (event: H3Event) => {
  const user = await getCurrentUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: '请先登录'
    })
  }

  return user
}
