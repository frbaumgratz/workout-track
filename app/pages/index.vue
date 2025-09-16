<template>
  <section class="grid grid-cols-1 lg:grid-cols-5 gap-16">
    <div class="lg:col-span-4">
      <CalendarGrid :entries="entries" @select="openModal" @month-change="onMonthChange" />
    </div>
    <div class="lg:col-span-1">
      <SummarySidebar
        :entries-month="entries"
        :entries-year="ytdEntries"
        :current-month="currentMonth"
        :loading-month="entriesLoading"
        :loading-year="ytdLoading"
      />
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <h3 class="font-medium mb-2">Activities</h3>
          <button class="text-sm underline" @click="toggleActivitiesVisible" v-if="activitiesVisible">Hide</button>
        </div>
        <div v-if="!activitiesVisible" class="text-sm text-gray-600">
          Activities manager hidden. Use "Manage Activities" in Tools to show.
        </div>
        <div v-else>
          <form @submit.prevent="addActivity" class="flex gap-2">
            <input v-model.trim="newActivity" placeholder="New activity" class="border rounded px-3 py-2 w-full" />
            <button class="px-3 py-2 bg-black text-white rounded" :disabled="!newActivity">Add</button>
          </form>
          <ul class="mt-3 space-y-1">
            <li v-for="a in activities" :key="a._id" class="flex items-center justify-between text-sm border rounded px-2 py-1">
              <template v-if="editingId === a._id">
                <input v-model.trim="editingName" class="border rounded px-2 py-1 w-full mr-2" />
                <div class="flex items-center gap-2 ml-2">
                  <button class="text-green-700" @click="saveEdit(a)">Save</button>
                  <button class="text-gray-600" @click="cancelEdit">Cancel</button>
                </div>
              </template>
              <template v-else>
                <span>{{ a.name }}</span>
                <div class="flex items-center gap-2">
                  <button class="text-gray-700" @click="startEdit(a)">Edit</button>
                  <button class="text-red-600" @click="removeActivity(a._id)">Delete</button>
                </div>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <dialog ref="modalRef" class="p-0 rounded-md w-96 max-w-[95vw]">
    <form method="dialog" class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Log activities</h3>
        <button class="px-2 py-1 border rounded">Close</button>
      </div>
    </form>
    <div class="p-4 space-y-3">
      <p class="text-sm text-gray-600">{{ selectedDateKey }}</p>
      <div class="flex items-center gap-3">
        <label class="inline-flex items-center gap-2">
          <input type="checkbox" v-model="restDay" />
          <span>Rest day (scheduled)</span>
        </label>
      </div>
      <div class="flex flex-wrap gap-2" :class="{ 'opacity-50 pointer-events-none': restDay }">
        <label v-for="name in dayActivityOptions" :key="name" class="inline-flex items-center gap-2 border rounded px-2 py-1">
          <input type="checkbox" :value="name" v-model="selectedActivities" />
          <span>{{ name }}</span>
        </label>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-2 bg-black text-white rounded" @click="saveEntry">Save</button>
        <button class="px-3 py-2 border rounded" @click="deleteEntry">Clear Day</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import CalendarGrid from '../components/CalendarGrid.vue'
import SummarySidebar from '../components/SummarySidebar.vue'
import { useActivities } from '../composables/useActivities'
import { useEntries } from '../composables/useEntries'
import { useAppEvents } from '../composables/useAppEvents'
import { useToast } from '../composables/useToast'

const { items: activities, fetchActivities, createActivity, deleteActivity, updateActivity } = useActivities()
// Month entries instance
const { items: entries, fetchRange, upsert, remove, removeActivityFromEntries } = useEntries()
// Year-to-date entries instance (separate to avoid clobbering month state)
const { items: ytdEntries, fetchRange: fetchYtdRange } = useEntries()
const { success, error: showError } = useToast()

const entriesLoading = ref(false)
const ytdLoading = ref(false)
const activitiesVisible = useState('activitiesVisible', () => false)
const selectedDateKey = ref('')
const selectedActivities = ref([])
const restDay = ref(false)
const modalRef = ref()
const newActivity = ref('')
const editingId = ref('')
const editingName = ref('')
const dayActivityOptions = computed(() => {
  const current = new Set((activities.value || []).map((x) => x.name))
  if (selectedDateKey.value) {
    const e = entries.value.find((x) => x.dateKey === selectedDateKey.value)
    for (const name of (e?.activities || [])) current.add(name)
  }
  return Array.from(current).sort()
})

function openModal(dateKey) {
  selectedDateKey.value = dateKey
  const e = entries.value.find((x) => x.dateKey === dateKey)
  selectedActivities.value = e?.activities ? [...e.activities] : []
  restDay.value = Boolean(e?.rest)
  modalRef.value?.showModal()
}

async function saveEntry() {
  if (!selectedDateKey.value) return
  try {
    await upsert(selectedDateKey.value, selectedActivities.value, restDay.value)
    await refreshData(currentMonth.value)
    success('Day saved')
    modalRef.value?.close()
  } catch (e) {
    showError('Failed to save day')
  }
}

async function deleteEntry() {
  if (!selectedDateKey.value) return
  try {
    await remove(selectedDateKey.value)
    await refreshData(currentMonth.value)
    success('Day cleared')
    modalRef.value?.close()
  } catch (e) {
    showError('Failed to clear day')
  }
}

async function addActivity() {
  if (!newActivity.value) return
  try {
    const name = newActivity.value
    await createActivity(name)
    success(`Added "${name}"`)
    newActivity.value = ''
  } catch (e) {
    showError('Failed to add activity')
  }
}

async function removeActivity(id) {
  const a = activities.value.find((x) => x._id === id)
  if (!a) return
  if (!confirm(`Delete activity "${a.name}" from the master list? This will not change past days.`)) return
  try {
    await deleteActivity(id)
    success(`Deleted "${a.name}" from master list`)
  } catch (e) {
    showError('Failed to delete activity')
  }
}

function startEdit(a) {
  editingId.value = a._id
  editingName.value = a.name
}

function cancelEdit() {
  editingId.value = ''
  editingName.value = ''
}

async function saveEdit(a) {
  const name = editingName.value.trim()
  if (!name || name === a.name) {
    cancelEdit()
    return
  }
  try {
    await updateActivity(a._id, name)
    await Promise.all([fetchActivities(), refreshData()])
    success(`Renamed to "${name}"`)
  } catch (e) {
    showError('Failed to rename activity')
  } finally {
    cancelEdit()
  }
}

async function onRemoveActivityFromEntries(name) {
  if (!confirm(`Remove "${name}" from all visible days?`)) return
  const baseDate = new Date()
  const fromKey = toKey(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1))
  const toKeyStr = toKey(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0))
  await removeActivityFromEntries(name, fromKey, toKeyStr)
  await refreshData(baseDate)
}

async function cleanActivityFromMonth(a) {
  if (!confirm(`Remove "${a.name}" from all visible days?`)) return
  const baseDate = new Date()
  const fromKey = toKey(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1))
  const toKeyStr = toKey(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0))
  await removeActivityFromEntries(a.name, fromKey, toKeyStr)
  await refreshData(baseDate)
}

function toKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0) }

async function refreshData(baseDate = new Date()) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const monthFromKey = toKey(new Date(year, month, 1))
  const monthToKey = toKey(endOfMonth(baseDate))
  const ytdFromKey = `${year}-01-01`
  const ytdToKey = monthToKey // YTD até fim do mês em foco
  entriesLoading.value = true
  ytdLoading.value = true
  await Promise.all([
    fetchRange(monthFromKey, monthToKey),
    fetchYtdRange(ytdFromKey, ytdToKey)
  ])
  entriesLoading.value = false
  ytdLoading.value = false
}

onMounted(async () => {
  await Promise.all([fetchActivities(), refreshData()])
})

const { onRefreshEntries, onShowActivityManager } = useAppEvents()
onRefreshEntries(async () => {
  await refreshData()
})

onShowActivityManager(() => {
  activitiesVisible.value = true
})

const currentMonth = ref(new Date())
function onMonthChange(d) {
  currentMonth.value = new Date(d)
  refreshData(currentMonth.value)
}

function toggleActivitiesVisible() {
  activitiesVisible.value = !activitiesVisible.value
}
</script>
