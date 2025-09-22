import { ObjectId } from 'mongodb'
import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  if (!id || typeof id !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Missing "id" query param' }
  }
  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const res = await db.collection('activities').deleteOne({ _id: new ObjectId(id), userId })
    return { deleted: res.deletedCount === 1 }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to delete activity' }
  }
})


