// Rota de exemplo para listar usuários a partir do MongoDB Atlas
// - Comentários em pt-BR
// - Nomes e retornos em inglês

import { H3Event, setResponseStatus } from 'h3'
import { getDb } from '../utils/mongo'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Lê query params simples (ex.: limit)
    const query = getQuery(event)
    const limit = Number(query.limit ?? 10)

    const db = await getDb()
    const items = await db
      .collection('users')
      .find({}, { limit })
      .toArray()

    return { items }
  } catch (err: any) {
    // Em caso de erro, retorna 500 com mensagem
    setResponseStatus(event, 500)
    return { error: 'Failed to list users', message: err?.message }
  }
})

