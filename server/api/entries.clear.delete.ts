import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  const { fromKey, toKey } = getQuery(event)
  if (typeof fromKey !== 'string' || typeof toKey !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected fromKey,toKey in YYYY-MM-DD' }
  }
  try {
    const db = await getDb()
    const res = await db.collection('entries').deleteMany({ dateKey: { $gte: fromKey, $lte: toKey } })
    return { deleted: res.deletedCount || 0 }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to clear entries' }
  }
})


