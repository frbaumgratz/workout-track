import { setResponseStatus } from 'h3'
import { getUserFromSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromSession(event)
    if (!user) {
      setResponseStatus(event, 401)
      return { error: 'UNAUTHORIZED' }
    }
    return { username: user.username }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { error: 'INTERNAL_ERROR', message: 'Failed to fetch current user' }
  }
})
