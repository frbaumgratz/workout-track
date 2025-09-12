import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  const { name, fromKey, toKey } = getQuery(event)
  if (typeof name !== 'string' || !name.trim()) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Missing "name"' }
  }
  const filter: any = { activities: name }
  if (typeof fromKey === 'string' && typeof toKey === 'string') {
    filter.dateKey = { $gte: fromKey, $lte: toKey }
  }
  try {
    const db = await getDb()
    const res = await db.collection('entries').updateMany(filter, { $pull: { activities: name } })
    return { removedFrom: res.modifiedCount }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to remove activity from entries' }
  }
})


