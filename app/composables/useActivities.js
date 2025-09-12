export function useActivities() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchActivities() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/activities')
      const list = (data?.items || []).map((x) => ({ ...x, _id: String(x._id) }))
      items.value = list
    } catch (e) {
      error.value = e
    }
    loading.value = false
  }

  async function createActivity(name) {
    await $fetch('/api/activities', { method: 'POST', body: { name } })
    await fetchActivities()
  }

  async function deleteActivity(id) {
    await $fetch('/api/activities', { method: 'DELETE', query: { id } })
    await fetchActivities()
  }

  async function updateActivity(id, name) {
    await $fetch('/api/activities', { method: 'PUT', body: { id, name } })
    await fetchActivities()
  }

  return { items, loading, error, fetchActivities, createActivity, deleteActivity, updateActivity }
}


