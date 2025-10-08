import { setResponseStatus } from 'h3'
import { getDb } from '../../utils/mongo'
import { hashPassword, createSession } from '../../utils/auth'

function normalizeUsername(v: string) {
  return v.trim().toLowerCase()
}

function isValidUsername(v: string) {
  return /^[a-z0-9_-]{3,32}$/.test(v)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected { username, password }' }
  }
  const usernameInput = body.username.trim()
  const password = body.password
  const usernameKey = normalizeUsername(usernameInput)
  if (!isValidUsername(usernameKey)) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Username must be 3-32 chars: a-z, 0-9, -, _' }
  }
  if (password.length < 6) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters' }
  }

  try {
    const db = await getDb()
    const existing = await db.collection('users').findOne({ usernameKey })
    if (existing) {
      setResponseStatus(event, 409)
      return { error: 'DUPLICATE', message: 'Username already exists' }
    }

    const now = new Date()
    const passwordHash = await hashPassword(password)
    const result = await db.collection('users').insertOne({
      username: usernameInput,
      usernameKey,
      passwordHash,
      createdAt: now,
      updatedAt: now
    })

    // Auto-login new user
    await createSession(event, result.insertedId)

    // Return minimal, fully-serializable payload
    return { username: usernameInput }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to register user' }
  }
})
