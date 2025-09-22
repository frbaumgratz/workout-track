import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const { fromKey, toKey } = getQuery(event)
  if (typeof fromKey !== 'string' || typeof toKey !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected fromKey,toKey in YYYY-MM-DD format' }
  }

  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const items = await db
      .collection('entries')
      .find({ userId, dateKey: { $gte: fromKey, $lte: toKey } })
      .sort({ dateKey: 1 })
      .toArray()
    return { items }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to fetch entries' }
  }
})


