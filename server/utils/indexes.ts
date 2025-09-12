// Utilidades para criação de índices e defaults no MongoDB
// Comentários em pt-BR; nomes em inglês

import { getDb } from './mongo'

export async function ensureActivityIndexes() {
  const db = await getDb()
  await db.collection('activities').createIndexes([
    { key: { name: 1 }, unique: true, name: 'uniq_name' }
  ])
}

export async function ensureEntryIndexes() {
  const db = await getDb()
  await db.collection('entries').createIndexes([
    { key: { dateKey: 1 }, unique: true, name: 'uniq_dateKey' },
    { key: { activities: 1 }, name: 'by_activity' }
  ])
}


