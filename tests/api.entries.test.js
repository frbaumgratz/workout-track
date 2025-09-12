import { describe, it, expect } from 'vitest'

describe('Entries API', () => {
  it('has route files present', async () => {
    const getExists = await import.meta.glob('../server/api/entries.get.ts', { eager: false })
    const putExists = await import.meta.glob('../server/api/entries.put.ts', { eager: false })
    const delExists = await import.meta.glob('../server/api/entries.delete.ts', { eager: false })
    expect(Object.keys(getExists).length).toBe(1)
    expect(Object.keys(putExists).length).toBe(1)
    expect(Object.keys(delExists).length).toBe(1)
  })
})


