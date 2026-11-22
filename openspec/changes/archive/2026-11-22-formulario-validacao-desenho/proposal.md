# Proposal

## Why

Validar apenas no servidor gasta requisição e atrasa um erro previsível; o exercício 04 precisa bloquear dados inválidos antes do envio e indicar o campo exato. O repositório já tem a camada de API, mas ainda não tem o formulário nem as regras de validação.

## What Changes

- Cria `src/components/validarDesenho.js` com a função pura `validarDesenho(valores)` e as constantes das regras.
- Cria `src/components/DesenhoForm.jsx` com formulário controlado de cinco campos: título, gênero, ano de lançamento, criador e sinopse.
- Define as mensagens por campo e o contrato `onCadastrar(payload) => Promise<boolean>` / `enviando: boolean`.
- Bloqueia o envio quando há erro, normaliza o payload e limpa os campos somente quando `onCadastrar` retorna `true`.
- **Fora de escopo**: chamadas à API, página, componente de feedback, layout, testes automatizados, edição/exclusão e novas dependências.

## Capabilities

### New Capabilities

- `catalogo-desenhos`: validação no cliente e formulário controlado de cadastro, com mensagens por campo, bloqueio de envio inválido e payload normalizado.

### Modified Capabilities

Nenhuma.

## Impact

- **Código novo**: `src/components/validarDesenho.js` e `src/components/DesenhoForm.jsx`.
- **Código existente**: nenhum arquivo de `src/api`, `src/App.jsx`, `package.json`, `db.json` ou configuração é alterado permanentemente.
- **Dependências**: nenhuma nova. `axios` e `json-server` já estão aprovados, mas não são usados por este change.
- **Verificação**: `node -e` para a função pura, `npm run lint`, `npm run build` e harness visual temporário.
- **Relação com o ciclo**: este change é o recorte do exercício 04 do change guarda-chuva `catalogo-desenhos`; os requisitos equivalentes devem ser reconciliados antes de arquivar os dois.
- **OpenSpec**: `openspec/specs/` vazio; este change usa `ADDED Requirements` para a capability `catalogo-desenhos`.
- **Git**: branch `formulario-validacao`; a entrega pode ser commitada junto com os artefatos deste change, conforme combinado pelo grupo.
