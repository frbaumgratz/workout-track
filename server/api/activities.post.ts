import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body.name !== 'string' || !body.name.trim()) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Missing or invalid "name"' }
  }
  const name = String(body.name).trim()
  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const now = new Date()
    const exists = await db.collection('activities').findOne({ userId, name })
    if (exists) {
      setResponseStatus(event, 409)
      return { error: 'DUPLICATE', message: 'Activity with this name already exists' }
    }
    const result = await db.collection('activities').insertOne({
      userId,
      name,
      createdAt: now,
      updatedAt: now
    })
    return { id: result.insertedId }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to create activity' }
  }
})


