import { setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'
import { requireUser } from '../utils/auth'

type UpsertBody = (
  { dateKey: string; activities?: string[]; rest?: boolean } |
  { date: string; activities?: string[]; rest?: boolean }
)

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<UpsertBody>
  if (!body || (!('dateKey' in body || 'date' in body))) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Body must include dateKey (YYYY-MM-DD) or date (ISO)' }
  }
  const dateKey = 'dateKey' in body && typeof body.dateKey === 'string' && body.dateKey.match(/^\d{4}-\d{2}-\d{2}$/)
    ? body.dateKey
    : (typeof (body as any).date === 'string' ? (body as any).date.slice(0,10) : undefined)
  if (!dateKey) {
    setResponseStatus(event, 400)
    return { error: 'VALIDATION_ERROR', message: 'Invalid date/dateKey format' }
  }

  const cleanActivities = Array.isArray(body.activities)
    ? body.activities.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean)
    : []
  const rest = Boolean((body as any).rest)
  // If rest is true, activities should be empty (enforced softly here)
  const activitiesToSave = rest ? [] : cleanActivities

  try {
    const { userId } = await requireUser(event)
    const db = await getDb()
    const now = new Date()
    const res = await db.collection('entries').updateOne(
      { userId, dateKey },
      { $set: { userId, activities: activitiesToSave, rest, dateKey, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    )
    return { upserted: Boolean(res.upsertedId), matched: res.matchedCount }
  } catch (err: any) {
    if (err?.statusCode === 401) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to upsert entry' }
  }
})


