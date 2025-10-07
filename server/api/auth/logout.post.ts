import { setResponseStatus } from 'h3'
import { destroySession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    await destroySession(event)
    return { ok: true }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to logout' }
  }
})
