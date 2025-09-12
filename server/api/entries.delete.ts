import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  const { dateKey } = getQuery(event)
  if (!dateKey || typeof dateKey !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Missing "dateKey" (YYYY-MM-DD)' }
  }
  try {
    const db = await getDb()
    const res = await db.collection('entries').deleteOne({ dateKey })
    return { deleted: res.deletedCount === 1 }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to delete entry' }
  }
})


