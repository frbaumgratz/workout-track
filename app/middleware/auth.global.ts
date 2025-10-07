export default defineNuxtRouteMiddleware(async (to) => {
  // Public routes
  const publicRoutes = new Set(['/login', '/register', '/about'])
  if (publicRoutes.has(to.path)) return

  const { useAuth } = await import('../composables/useAuth')
  const { user, fetchMe } = useAuth()

  if (!user.value) {
    try { await fetchMe() } catch {}
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
