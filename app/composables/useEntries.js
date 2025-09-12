export function useEntries() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchRange(fromKey, toKey) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/entries', { query: { fromKey, toKey } })
      const list = (data?.items || []).map((x) => ({ ...x, _id: String(x._id) }))
      items.value = list
    } catch (e) {
      error.value = e
    }
    loading.value = false
  }

  async function upsert(dateKey, activities) {
    await $fetch('/api/entries', { method: 'PUT', body: { dateKey, activities } })
  }

  async function remove(dateKey) {
    await $fetch('/api/entries', { method: 'DELETE', query: { dateKey } })
  }

  async function removeActivityFromEntries(name, fromKey, toKey) {
    const query = fromKey && toKey ? { name, fromKey, toKey } : { name }
    await $fetch('/api/entries-activity', { method: 'DELETE', query })
  }

  return { items, loading, error, fetchRange, upsert, remove, removeActivityFromEntries }
}


