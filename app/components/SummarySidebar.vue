<template>
  <aside class="space-y-3">
    <h2 class="text-lg font-semibold">Summary</h2>
    <div v-if="loading" class="space-y-2">
      <div class="h-4 bg-gray-200 rounded animate-pulse" />
      <div class="h-4 bg-gray-200 rounded animate-pulse" />
      <div class="h-4 bg-gray-200 rounded animate-pulse" />
    </div>
    <ul v-else>
      <li v-for="(count, name) in counts" :key="name" class="flex justify-between">
        <span>{{ name }}</span>
        <span class="text-sm text-gray-600">{{ count }}</span>
      </li>
    </ul>
  </aside>
  
</template>

<script setup>
const props = defineProps({ entries: { type: Array, default: () => [] }, loading: Boolean })
const counts = computed(() => {
  const map = new Map()
  for (const e of props.entries) {
    for (const a of e.activities || []) {
      map.set(a, (map.get(a) || 0) + 1)
    }
  }
  return Object.fromEntries([...map.entries()].sort((a,b) => b[1] - a[1]))
})
const loading = computed(() => props.loading)
</script>


