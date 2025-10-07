import { defineNitroPlugin } from 'nitropack/runtime'
import { ensureActivityIndexes, ensureEntryIndexes, ensureUserIndexes, ensureSessionIndexes } from '../utils/indexes'

export default defineNitroPlugin(async () => {
  try {
    await Promise.all([
      ensureActivityIndexes(),
      ensureEntryIndexes(),
      ensureUserIndexes(),
      ensureSessionIndexes()
    ])
  } catch {
    // Silent fail on boot to avoid crashing dev; handlers will still work
  }
})


