import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const items = await db.collection('activities').find({ userId }).sort({ name: 1 }).toArray()
    return { items }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to fetch activities' }
  }
})


