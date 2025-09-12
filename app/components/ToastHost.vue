<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <div class="absolute top-4 right-4 space-y-2 w-[280px]">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto p-3 rounded shadow text-sm text-white"
        :class="{
          'bg-green-600': t.type === 'success',
          'bg-red-600': t.type === 'error',
          'bg-gray-800': t.type !== 'success' && t.type !== 'error'
        }"
      >
        <div class="flex items-start justify-between gap-3">
          <span>{{ t.message }}</span>
          <button class="opacity-80 hover:opacity-100" @click="dismiss(t.id)">✕</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { useToast } from '../composables/useToast'
const { toasts, dismiss } = useToast()
</script>


