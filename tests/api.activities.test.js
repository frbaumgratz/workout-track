import { describe, it, expect } from 'vitest'

describe('Activities API', () => {
  it('has route files present', async () => {
    const getExists = await import.meta.glob('../server/api/activities.get.ts', { eager: false })
    const postExists = await import.meta.glob('../server/api/activities.post.ts', { eager: false })
    expect(Object.keys(getExists).length).toBe(1)
    expect(Object.keys(postExists).length).toBe(1)
  })
})


