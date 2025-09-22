<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-xl font-semibold mb-4">Register</h1>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <label class="block">
        <span class="text-sm">Username</span>
        <input v-model.trim="username" class="mt-1 w-full border rounded px-3 py-2" required />
      </label>
      <label class="block">
        <span class="text-sm">Password</span>
        <input v-model="password" type="password" class="mt-1 w-full border rounded px-3 py-2" required />
      </label>
      <p class="text-xs text-gray-500">At least 8 characters</p>
      <button class="px-4 py-2 bg-black text-white rounded disabled:opacity-50" :disabled="submitting">
        <span v-if="submitting">Creating...</span>
        <span v-else>Register</span>
      </button>
      <p v-if="message" class="text-sm text-red-600">{{ message }}</p>
    </form>
    <p class="mt-3 text-sm">Already have an account? <NuxtLink to="/login" class="underline">Login</NuxtLink></p>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

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
    message.value = 'Failed to register (username may be taken)'
  } finally {
    submitting.value = false
  }
}
</script>
