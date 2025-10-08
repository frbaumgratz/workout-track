import { ref } from 'vue'

const userState = ref(null)
const loadingState = ref(false)
const errorState = ref('')

export function useAuth() {
  async function fetchMe() {
    loadingState.value = true
    errorState.value = ''
    try {
      const data = await $fetch('/api/auth/me')
      userState.value = data ? { username: data.username } : null
    } catch (e) {
      userState.value = null
    } finally {
      loadingState.value = false
    }
  }

  async function login({ username, password }) {
    loadingState.value = true
    errorState.value = ''
    try {
      const data = await $fetch('/api/auth/login', { method: 'POST', body: { username, password } })
      userState.value = { username: data.username }
    } catch (e) {
      errorState.value = 'Invalid username or password'
      throw e
    } finally {
      loadingState.value = false
    }
  }

  async function register({ username, password }) {
    loadingState.value = true
    errorState.value = ''
    try {
      const data = await $fetch('/api/auth/register', { method: 'POST', body: { username, password } })
      userState.value = { username: data.username }
    } catch (e) {
      // Surface server-provided error when available
      errorState.value = e?.data?.message || e?.message || 'Failed to register'
      throw e
    } finally {
      loadingState.value = false
    }
  }

  async function logout() {
    loadingState.value = true
    errorState.value = ''
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      userState.value = null
    } catch (e) {
      errorState.value = 'Failed to logout'
      throw e
    } finally {
      loadingState.value = false
    }
  }

  return {
    user: userState,
    status: computed(() => (loadingState.value ? 'loading' : userState.value ? 'authenticated' : 'unauthenticated')),
    error: errorState,
    fetchMe,
    login,
    register,
    logout
  }
}
