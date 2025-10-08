<template>
  <div class="max-w-md mx-auto">
    <div class="mb-6 flex items-center gap-3">
      <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
        <Icon name="i-heroicons-arrow-right-on-rectangle" class="h-6 w-6" />
      </div>
      <div>
        <h1 class="text-xl font-semibold">Welcome back</h1>
        <p class="text-sm text-gray-500">Login to access your calendar.</p>
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
          <PasswordInput v-model="password" :required="true" autocomplete="current-password" />
        </label>
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50" :disabled="submitting">
          <span v-if="submitting">Logging in...</span>
          <span v-else>Login</span>
        </button>
        <p v-if="message" class="text-sm text-red-600">{{ message }}</p>
      </form>
      <p class="mt-3 text-sm">New here? <NuxtLink to="/register" class="underline text-blue-700">Create an account</NuxtLink></p>
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

const { login } = useAuth()

async function onSubmit() {
  submitting.value = true
  message.value = ''
  try {
    await login({ username: username.value, password: password.value })
    await navigateTo('/')
  } catch (e) {
    message.value = 'Invalid username or password'
  } finally {
    submitting.value = false
  }
}
</script>
