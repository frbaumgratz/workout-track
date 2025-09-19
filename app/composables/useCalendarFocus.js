export function useCalendarFocus() {
  const focusedMonth = useState('focusedMonth', () => new Date())

  function setFocusedMonth(date) {
    const d = date instanceof Date ? new Date(date) : new Date(String(date))
    // Normalize to first day of month for consistency
    focusedMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
  }

  return { focusedMonth, setFocusedMonth }
}



