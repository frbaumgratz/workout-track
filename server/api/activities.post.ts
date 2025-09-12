import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body.name !== 'string' || !body.name.trim()) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Missing or invalid "name"' }
  }
  const name = String(body.name).trim()
  try {
    const db = await getDb()
    const now = new Date()
    const result = await db.collection('activities').insertOne({
      name,
      createdAt: now,
      updatedAt: now
    })
    return { id: result.insertedId }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to create activity' }
  }
})


