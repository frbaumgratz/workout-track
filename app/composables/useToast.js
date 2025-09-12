export function useToast() {
  const toasts = useState('toasts', () => [])

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function push(message, type = 'info', timeoutMs = 2000) {
    const id = Math.random().toString(36).slice(2)
    toasts.value.push({ id, message, type })
    if (timeoutMs) setTimeout(() => dismiss(id), timeoutMs)
    return id
  }

  function success(message, timeoutMs = 2000) { return push(message, 'success', timeoutMs) }
  function error(message, timeoutMs = 3000) { return push(message, 'error', timeoutMs) }

  return { toasts, push, success, error, dismiss }
}


