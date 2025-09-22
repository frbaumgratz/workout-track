import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

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
    const { userId } = await requireUser(event)
    const db = await getDb()
    const res = await db.collection('entries').updateMany({ ...filter, userId }, { $pull: { activities: name } })
    return { removedFrom: res.modifiedCount }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to remove activity from entries' }
  }
})


