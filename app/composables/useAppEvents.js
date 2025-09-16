export function useAppEvents() {
  const refreshEntriesFlag = useState('refreshEntriesFlag', () => 0)
  const showActivityManagerFlag = useState('showActivityManagerFlag', () => 0)
  function emitRefreshEntries() {
    refreshEntriesFlag.value++
  }
  function onRefreshEntries(cb) {
    watch(refreshEntriesFlag, () => cb())
  }
  function emitShowActivityManager() {
    showActivityManagerFlag.value++
  }
  function onShowActivityManager(cb) {
    watch(showActivityManagerFlag, () => cb())
  }
  return { emitRefreshEntries, onRefreshEntries, emitShowActivityManager, onShowActivityManager }
}


