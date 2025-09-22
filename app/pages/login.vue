<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-xl font-semibold mb-4">Login</h1>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <label class="block">
        <span class="text-sm">Username</span>
        <input v-model.trim="username" class="mt-1 w-full border rounded px-3 py-2" required />
      </label>
      <label class="block">
        <span class="text-sm">Password</span>
        <input v-model="password" type="password" class="mt-1 w-full border rounded px-3 py-2" required />
      </label>
      <button class="px-4 py-2 bg-black text-white rounded disabled:opacity-50" :disabled="submitting">
        <span v-if="submitting">Logging in...</span>
        <span v-else>Login</span>
      </button>
      <p v-if="message" class="text-sm text-red-600">{{ message }}</p>
    </form>
    <p class="mt-3 text-sm">New here? <NuxtLink to="/register" class="underline">Create an account</NuxtLink></p>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

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
