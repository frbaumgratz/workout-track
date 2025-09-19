<template>
  <div class="relative">
    <div class="inline-flex gap-2">
      <button class="text-sm px-3 py-1.5 border rounded" @click="openDialog">Tools</button>
      <button
        class="text-sm px-3 py-1.5 border rounded"
        title="Manage activities (add/edit/delete)"
        @click="showActivitiesManager"
      >Manage Activities</button>
    </div>

    <dialog ref="dialogRef" class="p-0 rounded-md w-[480px] max-w-[95vw]">
      <form method="dialog" class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Tools</h3>
          <button class="px-2 py-1 border rounded">Close</button>
        </div>
      </form>
      <div class="p-4 space-y-4">
        <section>
          <h4 class="font-medium mb-2">Clean activity from date range</h4>
          <div class="space-y-3">
            <label class="block">
              <span class="text-sm">Activity</span>
              <select v-model="selectedName" class="mt-1 w-full border rounded px-3 py-2">
                <option value="" disabled>Select activity</option>
                <option v-for="name in activityOptions" :key="name" :value="name">{{ name }}</option>
              </select>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="text-sm">From</span>
                <input type="date" v-model="fromKey" class="mt-1 w-full border rounded px-3 py-2" />
              </label>
              <label class="block">
                <span class="text-sm">To</span>
                <input type="date" v-model="toKey" class="mt-1 w-full border rounded px-3 py-2" />
              </label>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-2 bg-black text-white rounded disabled:opacity-50"
                :disabled="!canClean"
                @click="clean"
              >Clean</button>
              <p v-if="message" class="text-sm">{{ message }}</p>
            </div>
          </div>
        </section>

        <section class="pt-4 border-t">
          <h4 class="font-medium mb-2">Clear entries for date range</h4>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="text-sm">From</span>
                <input type="date" v-model="clearFromKey" class="mt-1 w-full border rounded px-3 py-2" />
              </label>
              <label class="block">
                <span class="text-sm">To</span>
                <input type="date" v-model="clearToKey" class="mt-1 w-full border rounded px-3 py-2" />
              </label>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                :disabled="!canClear"
                @click="clearRange"
              >Clear range</button>
              <button
                class="px-3 py-2 bg-red-600 text-white rounded"
                @click="clearCurrentMonth"
                title="Clear all activities from current month"
              >Clear Current Month</button>
              <p v-if="clearMsg" class="text-sm">{{ clearMsg }}</p>
            </div>
          </div>
        </section>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { useAppEvents } from '../composables/useAppEvents'
import { useToast } from '../composables/useToast'
import { useCalendarFocus } from '../composables/useCalendarFocus'

const activities = ref([])
const markedNames = ref([])
const selectedName = ref('')
const fromKey = ref('')
const toKey = ref('')
const message = ref('')
const dialogRef = ref()

const { emitRefreshEntries, emitShowActivityManager } = useAppEvents()
const { success, error: showError } = useToast()

function toKeyFmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function presetMonth() {
  const { focusedMonth } = useCalendarFocus()
  const base = new Date(focusedMonth.value)
  fromKey.value = toKeyFmt(new Date(base.getFullYear(), base.getMonth(), 1))
  toKey.value = toKeyFmt(new Date(base.getFullYear(), base.getMonth() + 1, 0))
  clearFromKey.value = fromKey.value
  clearToKey.value = toKey.value
}

async function openDialog() {
  await fetchActivities()
  presetMonth()
  await fetchMarkedNames()
  message.value = ''
  selectedName.value = ''
  dialogRef.value?.showModal()
}

async function fetchActivities() {
  const data = await $fetch('/api/activities')
  activities.value = (data?.items || []).map((x) => ({ ...x, _id: String(x._id) }))
}

const canClean = computed(() => Boolean(selectedName.value && fromKey.value && toKey.value))

async function clean() {
  if (!canClean.value) return
  if (!confirm(`Remove "${selectedName.value}" from all days in the selected range?`)) return
  // Close dialog immediately after confirmation so user sees the calendar
  dialogRef.value?.close()
  try {
    await $fetch('/api/entries-activity', { method: 'DELETE', query: { name: selectedName.value, fromKey: fromKey.value, toKey: toKey.value } })
    message.value = 'Removed from selected range.'
    emitRefreshEntries()
    success('Removed from selected range')
  } catch (e) {
    message.value = 'Failed to clean.'
    showError('Failed to clean')
  }
}

const activityOptions = computed(() => {
  const set = new Set((activities.value || []).map((x) => x.name))
  for (const n of markedNames.value || []) set.add(n)
  return Array.from(set).sort()
})

watch(activityOptions, () => {
  if (selectedName.value && !activityOptions.value.includes(selectedName.value)) {
    selectedName.value = ''
  }
})

async function fetchMarkedNames() {
  if (!fromKey.value || !toKey.value) return
  const data = await $fetch('/api/entries', { query: { fromKey: fromKey.value, toKey: toKey.value } })
  const set = new Set()
  for (const e of (data?.items || [])) {
    for (const a of e.activities || []) set.add(a)
  }
  markedNames.value = Array.from(set)
}

watch([fromKey, toKey], async () => {
  await fetchMarkedNames()
})

const clearFromKey = ref('')
const clearToKey = ref('')
const clearMsg = ref('')
const canClear = computed(() => Boolean(clearFromKey.value && clearToKey.value))

async function clearRange() {
  if (!canClear.value) return
  if (!confirm('This will DELETE all entries in the selected range. Continue?')) return
  // Close dialog immediately after confirmation so user sees the calendar
  dialogRef.value?.close()
  try {
    await $fetch('/api/entries.clear', { method: 'DELETE', query: { fromKey: clearFromKey.value, toKey: clearToKey.value } })
    clearMsg.value = 'Cleared entries in range.'
    emitRefreshEntries()
    success('Cleared entries in range')
  } catch (e) {
    clearMsg.value = 'Failed to clear.'
    showError('Failed to clear')
  }
}

async function clearCurrentMonth() {
  const { focusedMonth } = useCalendarFocus()
  const base = new Date(focusedMonth.value)
  const currentMonth = base.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
  
  if (!confirm(`Tem certeza que deseja limpar todas as atividades de ${currentMonth}?`)) return
  
  // Close dialog immediately after confirmation so user sees the calendar
  dialogRef.value?.close()
  
  try {
    // Get focused month date range
    const fromKey = toKeyFmt(new Date(base.getFullYear(), base.getMonth(), 1))
    const toKey = toKeyFmt(new Date(base.getFullYear(), base.getMonth() + 1, 0))
    
    await $fetch('/api/entries.clear', { method: 'DELETE', query: { fromKey, toKey } })
    clearMsg.value = `Cleared all activities from ${currentMonth}.`
    emitRefreshEntries()
    success(`Cleared all activities from ${currentMonth}`)
  } catch (e) {
    clearMsg.value = 'Failed to clear current month.'
    showError('Failed to clear current month')
  }
}

function showActivitiesManager() {
  emitShowActivityManager()
}
</script>


