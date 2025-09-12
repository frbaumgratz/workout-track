import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDb()
    const items = await db.collection('activities').find({}).sort({ name: 1 }).toArray()
    return { items }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to fetch activities' }
  }
})


