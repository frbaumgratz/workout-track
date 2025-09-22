import { ObjectId } from 'mongodb'
import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body.id !== 'string' || typeof body.name !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected { id, name }' }
  }
  const id = body.id
  const newName = body.name.trim()
  if (!newName) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Name cannot be empty' }
  }
  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const _id = new ObjectId(id)
    const current = await db.collection('activities').findOne({ _id, userId })
    if (!current) {
      setResponseStatus(event, 404)
      return { error: 'NOT_FOUND', message: 'Activity not found' }
    }
    const oldName = String(current.name)
    if (oldName === newName) {
      return { updated: false }
    }
    const dup = await db.collection('activities').findOne({ name: newName, userId, _id: { $ne: _id } })
    if (dup) {
      setResponseStatus(event, 409)
      return { error: 'DUPLICATE', message: 'Activity with this name already exists' }
    }

    await db.collection('activities').updateOne({ _id, userId }, { $set: { name: newName, updatedAt: new Date() } })

    const res = await db.collection('entries').updateMany(
      { activities: oldName, userId },
      [
        {
          $set: {
            activities: {
              $map: {
                input: '$activities',
                as: 'a',
                in: { $cond: [{ $eq: ['$$a', oldName] }, newName, '$$a'] }
              }
            }
          }
        }
      ] as any
    )

    return { updated: true, renamedEntries: res.modifiedCount }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to update activity' }
  }
})


