export function useAppEvents() {
  const refreshEntriesFlag = useState('refreshEntriesFlag', () => 0)
  function emitRefreshEntries() {
    refreshEntriesFlag.value++
  }
  function onRefreshEntries(cb) {
    watch(refreshEntriesFlag, () => cb())
  }
  return { emitRefreshEntries, onRefreshEntries }
}


