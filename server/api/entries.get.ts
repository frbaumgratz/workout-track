import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  const { fromKey, toKey } = getQuery(event)
  if (typeof fromKey !== 'string' || typeof toKey !== 'string') {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Expected fromKey,toKey in YYYY-MM-DD format' }
  }

  try {
    const db = await getDb()
    const items = await db
      .collection('entries')
      .find({ dateKey: { $gte: fromKey, $lte: toKey } })
      .sort({ dateKey: 1 })
      .toArray()
    return { items }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to fetch entries' }
  }
})


