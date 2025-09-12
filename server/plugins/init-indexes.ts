import { defineNitroPlugin } from 'nitropack/runtime'
import { ensureActivityIndexes, ensureEntryIndexes } from '../utils/indexes'

export default defineNitroPlugin(async () => {
  try {
    await Promise.all([ensureActivityIndexes(), ensureEntryIndexes()])
  } catch {
    // Silent fail on boot to avoid crashing dev; handlers will still work
  }
})


