<template>
  <section>
    <div class="flex items-center justify-between mb-3">
      <div class="text-lg font-semibold">{{ monthLabel }}</div>
      <div class="flex gap-2">
        <button class="px-2 py-1 border rounded" @click="prevMonth">←</button>
        <button class="px-2 py-1 border rounded" @click="nextMonth">→</button>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-1 text-sm">
      <div v-for="d in weekDays" :key="d" class="text-center text-gray-500 py-1">{{ d }}</div>
      <button
        v-for="cell in cells"
        :key="cell.key"
        class="aspect-square border rounded p-1 text-left relative hover:bg-gray-50 disabled:opacity-30"
        :disabled="cell.monthOffset !== 0"
        @click="onSelect(cell.dateIso)"
      >
        <span class="text-xs absolute top-1 right-1">{{ cell.day }}</span>
        <div class="mt-4 flex flex-wrap gap-1">
          <span
            v-for="badge in cell.badges"
            :key="badge"
            class="px-1 py-0.5 text-[10px] bg-gray-200 rounded"
          >{{ badge }}</span>
        </div>
      </button>
    </div>
  </section>
  <slot />
</template>

<script setup>
const emit = defineEmits(['select'])
const props = defineProps({
  entries: { type: Array, default: () => [] }
})

const today = new Date()
const current = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() =>
  current.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
)

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0) }
function toIso(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

const cells = computed(() => {
  const start = startOfMonth(current.value)
  const end = endOfMonth(current.value)
  const startOffset = start.getDay()
  const totalDays = startOffset + end.getDate()
  const rows = Math.ceil(totalDays / 7)
  const firstCell = new Date(start)
  firstCell.setDate(start.getDate() - startOffset)
  const map = new Map()
  for (const e of props.entries) {
    const k = typeof e.dateKey === 'string' ? e.dateKey : undefined
    if (k) map.set(k, e.activities || [])
  }
  const out = []
  for (let i = 0; i < rows * 7; i++) {
    const d = new Date(firstCell)
    d.setDate(firstCell.getDate() + i)
    const key = toIso(d)
    out.push({
      key,
      dateIso: key,
      day: d.getDate(),
      monthOffset: d.getMonth() - current.value.getMonth(),
      badges: (map.get(key) || []).slice(0,3)
    })
  }
  return out
})

function prevMonth() {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth() - 1, 1)
}
function nextMonth() {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth() + 1, 1)
}
function onSelect(dateIso) { emit('select', dateIso) }
</script>


