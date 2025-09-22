import { setResponseStatus } from 'h3'
import { getDb } from '../../utils/mongo'
import { verifyPassword, createSession } from '../../utils/auth'

function normalizeUsername(v: string) {
  return v.trim().toLowerCase()
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected { username, password }' }
  }
  const usernameKey = normalizeUsername(body.username)
  try {
    const db = await getDb()
    const user = await db.collection('users').findOne({ usernameKey })
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED', message: 'Invalid credentials' }
    }
    const ok = await verifyPassword(body.password, user.passwordHash)
    if (!ok) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED', message: 'Invalid credentials' }
    }

    await createSession(event, user._id)
    return { username: user.username }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to login' }
  }
})
