import { ObjectId } from 'mongodb'
import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  if (!id || typeof id !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Missing "id" query param' }
  }
  try {
    const db = await getDb()
    const res = await db.collection('activities').deleteOne({ _id: new ObjectId(id) })
    return { deleted: res.deletedCount === 1 }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to delete activity' }
  }
})


