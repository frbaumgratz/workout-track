AI rules are located in the following directories:

- **@.cursor/rules/** — Project-wide rules and documentation, such as:

  - `PRD.mdc` (Product Requirements Document)
  - `ADR.mdc` (Architecture Decision Records)

- **@server/.cursor/rules/** — Backend-specific rules and structure, including:

  - `backend-workflow.mdc` (Backend development workflow)
  - `folder-structure.mdc` (Backend folder organization)
  - `ADR.mdc` (Backend architecture decisions)

- **@app/.cursor/rules/** — Frontend-specific rules and structure, including:
  - `frontend-workflow.mdc` (Frontend development workflow)
  - `folder-structure.mdc` (Frontend folder organization)
  - `ADR.mdc` (Frontend architecture decisions)

## Slack: mensagem curta (PT‑BR) após mudanças

Obrigatório após toda mudança de feature existente ou correção de bug (não se aplica a funcionalidades totalmente novas).

- O que incluir sempre:
  - O problema ou requisito original.
  - O que mudamos para corrigir/adaptar.
  - Como testar (passos rápidos ou cenários principais).
  - A branch do Git onde está a mudança.

Template (copiar/colar no Slack):

```
[Atualização] <resumo curto>

- O que era: <qual era o problema/requisito?>
- O que mudou: <o que alteramos para corrigir/adaptar?>
- Como testar: <passos rápidos / link para teste>
- Branch: <nome-da-branch> (<link, se aplicável>)
```
