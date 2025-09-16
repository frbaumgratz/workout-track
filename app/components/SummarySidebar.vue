<template>
  <aside class="space-y-4">
    <h2 class="text-lg font-semibold">Summary</h2>

    <div v-if="loadingAny" class="space-y-2">
      <div class="h-4 bg-gray-200 rounded animate-pulse" />
      <div class="h-4 bg-gray-200 rounded animate-pulse" />
      <div class="h-4 bg-gray-200 rounded animate-pulse" />
    </div>

    <template v-else>
      <section class="space-y-1">
        <h3 class="font-medium">Totals</h3>
        <div class="text-sm text-gray-700 flex items-center justify-between">
          <span>Month: days active</span>
          <span class="text-gray-900">{{ totals.month.daysActive }}</span>
        </div>
        <div class="text-sm text-gray-700 flex items-center justify-between">
          <span>Month: activities</span>
          <span class="text-gray-900">{{ totals.month.totalActivities }}</span>
        </div>
        <div class="text-sm text-gray-700 flex items-center justify-between">
          <span>Year: days active</span>
          <span class="text-gray-900">{{ totals.year.daysActive }}</span>
        </div>
        <div class="text-sm text-gray-700 flex items-center justify-between">
          <span>Year: activities</span>
          <span class="text-gray-900">{{ totals.year.totalActivities }}</span>
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="font-medium">Streaks</h3>
        <div class="text-sm grid grid-cols-2 gap-x-3 gap-y-1">
          <div class="flex items-center justify-between"><span>Any (month)</span><span class="text-gray-900">{{ streaks.month.any }}</span></div>
          <div class="flex items-center justify-between"><span>Any (year)</span><span class="text-gray-900">{{ streaks.year.any }}</span></div>
          <div class="flex items-center justify-between"><span>Negative (month)</span><span class="text-gray-900">{{ streaks.month.negative }}</span></div>
          <div class="flex items-center justify-between"><span>Negative (year)</span><span class="text-gray-900">{{ streaks.year.negative }}</span></div>
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="font-medium">Activities</h3>
        <ul class="space-y-1">
          <li v-for="row in activityRows" :key="row.name" class="flex items-center justify-between text-sm">
            <span class="truncate mr-2">{{ row.name }}</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-700">M {{ row.monthCount }} · Y {{ row.yearCount }}</span>
              <span v-if="row.streakMonth" class="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700">S M {{ row.streakMonth }}</span>
              <span v-if="row.streakYear" class="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700">S Y {{ row.streakYear }}</span>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </aside>
  
</template>

<script setup>
const props = defineProps({
  entriesMonth: { type: Array, default: () => [] },
  entriesYear: { type: Array, default: () => [] },
  currentMonth: { type: [Object, String], default: '' },
  loadingMonth: Boolean,
  loadingYear: Boolean
})

const loadingAny = computed(() => props.loadingMonth || props.loadingYear)

function toKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0) }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }


function mapByDate(entries) {
  const map = new Map()
  for (const e of entries || []) {
    const k = typeof e.dateKey === 'string' ? e.dateKey : undefined
    if (!k) continue
    const activities = Array.isArray(e.activities) ? e.activities : []
    const rest = Boolean((e && e.rest) || false)
    map.set(k, { activities, rest })
  }
  return map
}

function iterDateKeys(from, to) {
  const out = []
  for (let d = new Date(from); d <= to; d = addDays(d, 1)) {
    out.push(toKey(d))
  }
  return out
}

function computeTotals(dateMap, from, to) {
  let daysActive = 0
  let totalActivities = 0
  for (const k of iterDateKeys(from, to)) {
    const rec = dateMap.get(k)
    const acts = rec?.activities || []
    if (acts.length > 0) daysActive++
    totalActivities += acts.length
  }
  return { daysActive, totalActivities }
}

function computeActivityCounts(dateMap, from, to) {
  const map = new Map()
  for (const k of iterDateKeys(from, to)) {
    const acts = (dateMap.get(k)?.activities) || []
    for (const a of acts) map.set(a, (map.get(a) || 0) + 1)
  }
  return map
}

function computeCurrentAnyStreak(dateMap, from, to) {
  let count = 0
  for (let d = new Date(to); d >= from; d = addDays(d, -1)) {
    const rec = dateMap.get(toKey(d))
    const acts = rec?.activities || []
    const isRest = Boolean(rec?.rest)
    if (acts.length > 0) {
      count++
    } else if (isRest) {
      // rest: does not break, does not add
      continue
    } else {
      break
    }
  }
  return count
}

function computeCurrentNegativeStreak(dateMap, from, to) {
  let count = 0
  for (let d = new Date(to); d >= from; d = addDays(d, -1)) {
    const rec = dateMap.get(toKey(d))
    const acts = rec?.activities || []
    const isRest = Boolean(rec?.rest)
    if (acts.length === 0 && !isRest) {
      count++
    } else {
      break
    }
  }
  return count
}

function computeCurrentActivityStreak(dateMap, from, to, activityName) {
  let count = 0
  for (let d = new Date(to); d >= from; d = addDays(d, -1)) {
    const rec = dateMap.get(toKey(d))
    const acts = rec?.activities || []
    const isRest = Boolean(rec?.rest)
    if (acts.includes(activityName)) {
      count++
    } else if (isRest) {
      // rest: does not break
      continue
    } else {
      break
    }
  }
  return count
}

const totals = computed(() => {
  const baseMonth = props.currentMonth ? new Date(props.currentMonth) : new Date()
  const mFrom = startOfMonth(baseMonth)
  const mTo = endOfMonth(baseMonth)
  const yFrom = new Date(baseMonth.getFullYear(), 0, 1)
  const yTo = mTo
  const monthMap = mapByDate(props.entriesMonth)
  const yearMap = mapByDate(props.entriesYear)
  return {
    month: computeTotals(monthMap, mFrom, mTo),
    year: computeTotals(yearMap, yFrom, yTo)
  }
})

const streaks = computed(() => {
  const baseMonth = props.currentMonth ? new Date(props.currentMonth) : new Date()
  const mFrom = startOfMonth(baseMonth)
  const mTo = endOfMonth(baseMonth)
  const yFrom = new Date(baseMonth.getFullYear(), 0, 1)
  const yTo = mTo
  const monthMap = mapByDate(props.entriesMonth)
  const yearMap = mapByDate(props.entriesYear)
  return {
    month: {
      any: computeCurrentAnyStreak(monthMap, mFrom, mTo),
      negative: computeCurrentNegativeStreak(monthMap, mFrom, mTo)
    },
    year: {
      any: computeCurrentAnyStreak(yearMap, yFrom, yTo),
      negative: computeCurrentNegativeStreak(yearMap, yFrom, yTo)
    }
  }
})

const activityRows = computed(() => {
  const baseMonth = props.currentMonth ? new Date(props.currentMonth) : new Date()
  const mFrom = startOfMonth(baseMonth)
  const mTo = endOfMonth(baseMonth)
  const yFrom = new Date(baseMonth.getFullYear(), 0, 1)
  const yTo = mTo
  const monthMap = mapByDate(props.entriesMonth)
  const yearMap = mapByDate(props.entriesYear)
  const monthCounts = computeActivityCounts(monthMap, mFrom, mTo)
  const yearCounts = computeActivityCounts(yearMap, yFrom, yTo)
  const names = new Set([...monthCounts.keys(), ...yearCounts.keys()])
  const rows = []
  for (const name of names) {
    rows.push({
      name,
      monthCount: monthCounts.get(name) || 0,
      yearCount: yearCounts.get(name) || 0,
      streakMonth: computeCurrentActivityStreak(monthMap, mFrom, mTo, name),
      streakYear: computeCurrentActivityStreak(yearMap, yFrom, yTo, name)
    })
  }
  rows.sort((a, b) => (b.monthCount - a.monthCount) || a.name.localeCompare(b.name))
  return rows
})
</script>


