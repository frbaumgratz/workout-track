import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

type UpsertBody = { dateKey: string; activities: string[] } | { date: string; activities: string[] }

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<UpsertBody>
  if (!body || (!('dateKey' in body || 'date' in body)) || !Array.isArray(body.activities)) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Body must include dateKey (YYYY-MM-DD) or date (ISO) and activities (string[])' }
  }
  const dateKey = 'dateKey' in body && typeof body.dateKey === 'string' && body.dateKey.match(/^\d{4}-\d{2}-\d{2}$/)
    ? body.dateKey
    : (typeof (body as any).date === 'string' ? (body as any).date.slice(0,10) : undefined)
  if (!dateKey) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Invalid date/dateKey format' }
  }

  const cleanActivities = body.activities
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)

  try {
    const db = await getDb()
    const now = new Date()
    const res = await db.collection('entries').updateOne(
      { dateKey },
      { $set: { activities: cleanActivities, dateKey, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    )
    return { upserted: Boolean(res.upsertedId), matched: res.matchedCount }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to upsert entry' }
  }
})


