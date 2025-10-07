// Utilidades para criação de índices e defaults no MongoDB
// Comentários em pt-BR; nomes em inglês

import { getDb } from './mongo'

export async function ensureActivityIndexes() {
  const db = await getDb()
  await db.collection('activities').createIndexes([
    { key: { userId: 1, name: 1 }, unique: true, name: 'uniq_userId_name' }
  ])
}

export async function ensureEntryIndexes() {
  const db = await getDb()
  await db.collection('entries').createIndexes([
    { key: { userId: 1, dateKey: 1 }, unique: true, name: 'uniq_userId_dateKey' },
    { key: { userId: 1, activities: 1 }, name: 'by_userId_activity' }
  ])
}

export async function ensureUserIndexes() {
  const db = await getDb()
  await db.collection('users').createIndexes([
    { key: { usernameKey: 1 }, unique: true, name: 'uniq_usernameKey' }
  ])
}

export async function ensureSessionIndexes() {
  const db = await getDb()
  await db.collection('sessions').createIndexes([
    { key: { expiresAt: 1 }, expireAfterSeconds: 0, name: 'ttl_expiresAt' }
  ])
}


