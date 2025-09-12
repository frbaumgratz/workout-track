// Validações simples e serializadores para entradas e atividades
// Comentários em pt-BR; nomes em inglês

export function isIsoDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const d = new Date(value)
  return !isNaN(d.getTime())
}

export function normalizeActivityName(name: unknown): string | undefined {
  if (typeof name !== 'string') return undefined
  const v = name.trim()
  return v || undefined
}

export function normalizeActivities(list: unknown): string[] | undefined {
  if (!Array.isArray(list)) return undefined
  const out = list
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
  return out
}


