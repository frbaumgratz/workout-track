<template>
  <section>
    <div class="flex items-center justify-between mb-3">
      <div class="text-lg font-semibold">{{ monthLabel }}</div>
      <div class="flex gap-2">
        <button class="px-2 py-1 border rounded" @click="prevMonth">←</button>
        <button class="px-2 py-1 border rounded" @click="nextMonth">→</button>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-3 text-sm">
      <div v-for="d in weekDays" :key="d" class="text-center text-gray-500 py-3 font-medium text-base">{{ d }}</div>
      <button
        v-for="cell in cells"
        :key="cell.key"
        class="aspect-square border rounded p-3 text-left relative hover:bg-gray-50 disabled:opacity-30"
        :class="{
          'bg-green-50 border-green-200': cell.hasActivities,
          'bg-yellow-50 border-yellow-200': cell.isRest,
          'bg-red-50 border-red-200': cell.isNegativeRun,
          'bg-white': !cell.hasActivities && !cell.isRest && !cell.isNegativeRun && cell.monthOffset === 0
        }"
        :disabled="cell.monthOffset !== 0"
        @click="onSelect(cell.dateIso)"
      >
        <span class="text-base font-semibold absolute top-2 right-2">{{ cell.day }}</span>
        <div class="mt-7 flex flex-wrap gap-1.5">
          <span
            v-for="badge in cell.badges"
            :key="badge"
            class="px-2 py-1 text-xs bg-gray-200 rounded-full truncate max-w-full"
            :title="badge"
          >{{ badge }}</span>
          <span
            v-if="cell.totalActivities > cell.badges.length"
            class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
          >+{{ cell.totalActivities - cell.badges.length }}</span>
        </div>
      </button>
    </div>
  </section>
  <slot />
</template>

<script setup>
const emit = defineEmits(['select', 'month-change'])
const props = defineProps({
  entries: { type: Array, default: () => [] }
})

import { useCalendarFocus } from '../composables/useCalendarFocus'
const { focusedMonth, setFocusedMonth } = useCalendarFocus()
const current = computed({
  get() { return new Date(focusedMonth.value) },
  set(v) { setFocusedMonth(v) }
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() =>
  current.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
)

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0) }
function toIso(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }

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
    if (k) map.set(k, { activities: e.activities || [], rest: Boolean(e.rest) })
  }
  const out = []
  for (let i = 0; i < rows * 7; i++) {
    const d = new Date(firstCell)
    d.setDate(firstCell.getDate() + i)
    const key = toIso(d)
    const rec = map.get(key) || { activities: [], rest: false }
    const activities = rec.activities || []
    const isRest = Boolean(rec.rest)
    out.push({
      key,
      dateIso: key,
      day: d.getDate(),
      monthOffset: d.getMonth() - current.value.getMonth(),
      badges: activities.slice(0, 4), // Mostrar até 4 atividades
      totalActivities: activities.length,
      hasActivities: activities.length > 0,
      isRest,
      isNegativeRun: false
    })
  }
  // Mark negative streak runs (>=4) inside current month view, capped at today
  // We check consecutive days with no activities and no rest
  for (let i = 0; i < out.length; i++) {
    if (out[i].monthOffset !== 0) continue
    // do not mark future dates as negative
    const today = startOfDay(new Date())
    // Find contiguous segment starting at i
    let j = i
    while (
      j < out.length &&
      out[j].monthOffset === 0 &&
      !out[j].hasActivities &&
      !out[j].isRest &&
      new Date(out[j].dateIso) <= today
    ) {
      j++
    }
    const len = j - i
    if (len >= 4) {
      for (let k = i; k < j; k++) out[k].isNegativeRun = true
    }
    i = j
  }
  return out
})

function prevMonth() {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth() - 1, 1)
  emit('month-change', current.value)
}
function nextMonth() {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth() + 1, 1)
  emit('month-change', current.value)
}
function onSelect(dateIso) { emit('select', dateIso) }

onMounted(() => {
  emit('month-change', current.value)
})
</script>


