// Utilitário de conexão com MongoDB (server-side)
// - Comentários em pt-BR
// - Nomes de variáveis e funções em inglês

import { MongoClient } from 'mongodb'

const uri = process.env.NUXT_MONGODB_URI as string | undefined

// Reutiliza cliente entre HMR/reloads em dev
declare global {
  // eslint-disable-next-line no-var
  var __mongoClient__: MongoClient | undefined
}

let client: MongoClient | undefined = globalThis.__mongoClient__

export async function getMongoClient() {
  // Garante que a URI esteja definida
  if (!uri) {
    throw new Error('Missing NUXT_MONGODB_URI environment variable')
  }

  // Reutiliza instância existente (MongoDB Driver v6 não expõe topology.isConnected)
  if (client) {
    return client
  }

  client = new MongoClient(uri)
  await client.connect()
  globalThis.__mongoClient__ = client
  return client
}

export async function getDb(dbName?: string) {
  // Retorna a database default da connection string quando não informado
  const c = await getMongoClient()
  return c.db(dbName)
}

