<template>
  <div class="max-w-md mx-auto">
    <div class="mb-6 flex items-center gap-3">
      <div class="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
        <Icon name="i-heroicons-user-plus" class="h-6 w-6" />
      </div>
      <div>
        <h1 class="text-xl font-semibold">Create your account</h1>
        <p class="text-sm text-gray-500">New here? Register to start tracking.</p>
      </div>
    </div>

    <div class="p-4 border rounded-lg bg-white shadow-sm">
      <form @submit.prevent="onSubmit" class="space-y-3">
        <label class="block">
          <span class="text-sm">Username</span>
          <input v-model.trim="username" class="mt-1 w-full border rounded px-3 py-2" required />
        </label>
        <label class="block">
          <span class="text-sm">Password</span>
          <PasswordInput v-model="password" :required="true" autocomplete="new-password" />
        </label>
        <p class="text-xs text-gray-500">At least 6 characters</p>
        <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50" :disabled="submitting">
          <span v-if="submitting">Creating...</span>
          <span v-else>Register</span>
        </button>
        <p v-if="message" class="text-sm text-red-600">{{ message }}</p>
      </form>
      <p class="mt-3 text-sm">Already have an account? <NuxtLink to="/login" class="underline text-green-700">Login</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import PasswordInput from '../components/PasswordInput.vue'

const username = ref('')
const password = ref('')
const submitting = ref(false)
const message = ref('')

const { register } = useAuth()

async function onSubmit() {
  submitting.value = true
  message.value = ''
  try {
    await register({ username: username.value, password: password.value })
    await navigateTo('/')
  } catch (e) {
    // Prefer server-provided validation error when available
    const serverMessage = e?.data?.message || e?.message
    message.value = serverMessage || 'Failed to register'
  } finally {
    submitting.value = false
  }
}
</script>
