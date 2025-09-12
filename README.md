# nox-nuxt-v4 (Template Reutilizável)

Template leve e pronto para uso com Nuxt 4, focado em JavaScript no app e TypeScript apenas para arquivos de configuração.

## Tecnologias

- Nuxt 4 (SSR/SSG) com Nitro
- JavaScript em componentes/páginas; TypeScript só em configs
- Tailwind CSS (`@nuxtjs/tailwindcss`)
- Pinia, VueUse, Nuxt Icon
- Testes com Vitest
- Banco de dados: MongoDB Atlas (via APIs de servidor do Nuxt)

## Como começar

- GitHub: clique em "Use this template" e crie o repositório
- degit:
  - `pnpm dlx degit SUA_ORG/nox-nuxt-v4 meu-app`
  - `cd meu-app && pnpm i`
  - `pnpm dev`

## Scripts

- `pnpm dev`: servidor de desenvolvimento
- `pnpm build`: build de produção
- `pnpm preview`: preview do build
- `pnpm typecheck`: checagem de tipos (configs)
- `pnpm test`: testes com Vitest

## Variáveis de ambiente

- Privado: `NUXT_API_SECRET`
- Público: `NUXT_PUBLIC_APP_NAME`, `NUXT_PUBLIC_API_BASE`
- Banco: `NUXT_MONGODB_URI` (string de conexão do MongoDB Atlas)

Crie `.env` a partir de `.env.example` e ajuste os valores. Variáveis públicas são expostas no cliente.

## Padrões do projeto

- Nomes de variáveis e funções: em inglês
- Comentários e documentação: em português (pt-BR)
- Código do app (SFCs): JavaScript (sem `lang="ts"`)
- Conexão com banco: apenas no servidor (APIs Nitro); nunca no cliente

## Estrutura

- `app/layouts/`, `app/pages/`: UI base e rotas
- `assets/`: estilos (Tailwind)
- `server/api/`: endpoints (adicione aqui suas rotas para acessar o MongoDB)
- `nuxt.config.ts`: configurações do Nuxt e módulos

## Integração com MongoDB Atlas (guia rápido)

1. Crie um cluster no MongoDB Atlas e gere a connection string.
2. Defina `NUXT_MONGODB_URI` no `.env`.
3. Crie um cliente no servidor (ex.: `server/utils/mongo.ts`) usando o driver oficial ou Mongoose.
4. Consuma esse cliente nos handlers em `server/api/*`.

Exemplo (driver oficial):

```ts
// server/utils/mongo.ts (TypeScript permitido em utils de servidor)
import { MongoClient } from 'mongodb'

const uri = process.env.NUXT_MONGODB_URI as string
let client: MongoClient

export async function getMongoClient() {
  if (!client) client = new MongoClient(uri)
  if (!client.topology?.isConnected()) await client.connect()
  return client
}
```

```ts
// server/api/health.get.ts
export default defineEventHandler(async () => {
  return { ok: true }
})
```

Endpoint de exemplo usando o utilitário (lista usuários):

```ts
// server/api/users.get.ts
// GET /api/users?limit=10
export default defineEventHandler(async (event) => {
  const { getDb } = await import('~/server/utils/mongo')
  const query = getQuery(event)
  const limit = Number(query.limit ?? 10)
  const db = await getDb()
  const items = await db.collection('users').find({}, { limit }).toArray()
  return { items }
})
```

## Licença

Uso interno na organização.
