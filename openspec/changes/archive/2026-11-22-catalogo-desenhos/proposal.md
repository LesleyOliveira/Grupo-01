# Proposal

## Why

O projeto é um trabalho acadêmico de front-end que precisa demonstrar, de ponta a ponta, o consumo de uma API HTTP com listagem, cadastro e tratamento de erro especificado. Hoje o repositório contém apenas o template inicial do Vite: não há camada de acesso a dados, nem as pastas `src/api`, `src/components` e `src/pages` exigidas.

Começar por uma única funcionalidade bem especificada, em vez de um sistema inteiro gerado sem revisão, permite que os seis integrantes implementem partes pequenas, revisáveis e verificáveis, criando um padrão reaproveitável para os próximos ciclos do framework.

## What Changes

- Cria a estrutura de pastas `src/api`, `src/components` e `src/pages`, ainda inexistente no projeto.
- Introduz a funcionalidade **catálogo de desenhos animados**, com listagem e cadastro na mesma página.
- Adiciona uma camada de acesso HTTP com Axios, centralizada em um cliente único configurado por `VITE_API_URL`.
- Adiciona um mock local com `json-server` e o arquivo `db.json` contendo a coleção `desenhos`, com intenção declarada de migrar depois para um back-end próprio.
- Especifica o comportamento de erro obrigatório: falha ao carregar a listagem exibe mensagem e botão "Tentar novamente".
- Define validações de formulário no cliente, impedindo o envio de dados inválidos.
- Define a divisão de trabalho entre os seis integrantes, com instruções, explicações e trechos de código em `tasks.md`.
- **Fora de escopo**: cadastro de personagens (previsto para um segundo ciclo), autenticação, imagens/URLs de imagens, testes automatizados e back-end próprio.
- **Restrição de dependências**: nenhuma biblioteca nova pode ser adicionada sem consulta e aprovação prévia do grupo. Aprovadas até aqui: `axios` (runtime) e `json-server` (desenvolvimento).

## Capabilities

### New Capabilities

- `catalogo-desenhos`: comportamento observável do catálogo de desenhos animados — carregar e listar desenhos a partir da API HTTP, cadastrar um novo desenho com validação no cliente e tratar a indisponibilidade da API com mensagem e nova tentativa.

### Modified Capabilities

Nenhuma. O projeto ainda não possui specs em `openspec/specs/`.

## Impact

- **Código novo**: `src/api/apiClient.js`, `src/api/desenhosApi.js`, `src/components/DesenhoList.jsx`, `src/components/DesenhoForm.jsx`, `src/components/validarDesenho.js`, `src/components/Feedback.jsx`, `src/pages/CatalogoDesenhos.jsx`, `src/App.jsx` e `src/App.css`.
- **Configuração**: `.env` com `VITE_API_URL`, `vite.config.js` sem alteração, `db.json` e novas entradas em `package.json` (`axios`, `json-server` e script `server`). Mock e Vite rodam em dois terminais, sem adicionar uma biblioteca de execução paralela.
- **APIs**: `GET /desenhos` e `POST /desenhos` em um mock `json-server` na porta 3001.
- **Dependências**: `axios` e `json-server` (ambas aprovadas pelo grupo).
- **Versionamento**: exige repositório Git inicializado nesta pasta, com `specs`, `design` e `tasks` deste ciclo commitados junto ao código. Observação: a pasta do projeto ainda não é um repositório Git.
