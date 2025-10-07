import { H3Event, getHeader, setCookie, deleteCookie, getCookie } from 'h3'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { getDb } from './mongo'

export type AuthUser = { _id: any; username: string }

function getConfig() {
  const runtime = useRuntimeConfig()
  const { cookieName, sessionDays, secureCookies } = runtime.auth || { cookieName: 'sid', sessionDays: 365, secureCookies: process.env.NODE_ENV === 'production' }
  return { cookieName, sessionDays, secureCookies }
}

export async function hashPassword(plain: string) {
  const saltRounds = 10
  return bcrypt.hash(plain, saltRounds)
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

export async function createSession(event: H3Event, userId: any) {
  const { cookieName, sessionDays, secureCookies } = getConfig()
  const db = await getDb()
  const token = randomBytes(32).toString('hex')
  const now = new Date()
  const expiresAt = new Date(now.getTime() + sessionDays * 24 * 60 * 60 * 1000)

  await db.collection('sessions').insertOne({ _id: token, userId, createdAt: now, expiresAt, ip: getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || undefined, userAgent: getHeader(event, 'user-agent') || undefined })

  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: Boolean(secureCookies),
    maxAge: sessionDays * 24 * 60 * 60,
    path: '/'
  })
}

export async function destroySession(event: H3Event) {
  const { cookieName } = getConfig()
  const db = await getDb()
  const token = getCookie(event, cookieName)
  if (token) {
    await db.collection('sessions').deleteOne({ _id: token })
  }
  deleteCookie(event, cookieName, { path: '/' })
}

export async function getUserFromSession(event: H3Event): Promise<AuthUser | null> {
  const { cookieName } = getConfig()
  const db = await getDb()
  const token = getCookie(event, cookieName)
  if (!token) return null
  const session = await db.collection('sessions').findOne({ _id: token })
  if (!session || !session.expiresAt || session.expiresAt < new Date()) {
    return null
  }
  const user = await db.collection('users').findOne({ _id: session.userId })
  if (!user) return null
  return { _id: user._id, username: user.username }
}

export async function requireUser(event: H3Event): Promise<{ userId: any; user: AuthUser }> {
  const user = await getUserFromSession(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'UNAUTHORIZED' })
  }
  return { userId: user._id, user }
}
