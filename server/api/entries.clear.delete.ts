import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const { fromKey, toKey } = getQuery(event)
  if (typeof fromKey !== 'string' || typeof toKey !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected fromKey,toKey in YYYY-MM-DD' }
  }
  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const res = await db.collection('entries').deleteMany({ userId, dateKey: { $gte: fromKey, $lte: toKey } })
    return { deleted: res.deletedCount || 0 }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to clear entries' }
  }
})


