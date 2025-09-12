# Contribuição

Obrigado por contribuir! Este documento resume diretrizes de commits e comunicação.

## Mensagens de commit

- Use Conventional Commits (`feat`, `fix`, `docs`, `refactor`, etc.).
- Escreva no imperativo e mantenha títulos curtos (<= 72 chars).
- Descreva no corpo o “porquê” e qualquer contexto relevante.

## Slack: mensagem curta (PT‑BR) após mudanças

Após cada mudança em uma feature existente ou correção de bug (não se aplica a novas funcionalidades), publique uma mensagem curta no Slack.

- Incluir sempre:
  - Problema/requisito original.
  - O que mudamos para corrigir/adaptar.
  - Como testar (passos rápidos ou cenários principais).
  - A branch do Git com as alterações.

Template (copiar/colar no Slack):

```
[Atualização] <resumo curto>

- O que era: <qual era o problema/requisito?>
- O que mudou: <o que alteramos para corrigir/adaptar?>
- Como testar: <passos rápidos / link para teste>
- Branch: <nome-da-branch> (<link, se aplicável>)
```
