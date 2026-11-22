# Design

## Context

Ver `proposal.md` para motivação e `specs/catalogo-desenhos/spec.md` para o comportamento exigido.

Estado atual do repositório:

- React 19 + Vite 8 já instalados; nenhuma outra dependência de runtime.
- `src/App.jsx` contém apenas o template do Vite; `src/api`, `src/components` e `src/pages` não existem.
- `openspec/` está inicializado, mas sem specs principais.
- A pasta do projeto ainda não é um repositório Git.
- O grupo tem seis integrantes: Alexandre, Mauro, João, Tiago, Claudiana e Lesley.
- Regra do grupo: nenhuma biblioteca é adicionada sem consulta e aprovação. Aprovadas: `axios` e `json-server`.

## Goals / Non-Goals

**Goals:**

- Entregar uma funcionalidade completa e verificável que sirva de referência para os próximos ciclos.
- Manter componentes e páginas independentes do mock, para permitir a troca por um back-end próprio alterando apenas configuração.
- Permitir que seis pessoas trabalhem em paralelo com arquivos de responsabilidade exclusiva.

**Non-Goals:**

- Roteamento entre páginas, navegação ou estado global.
- Cadastro ou exibição de personagens.
- Imagens, uploads ou URLs de imagem.
- Autenticação, paginação, busca, edição e exclusão de desenhos.
- Testes automatizados e biblioteca de formulários no primeiro ciclo.

## Decisions

### 1. Axios em um cliente único configurado por `VITE_API_URL`

`src/api/apiClient.js` cria uma instância com `baseURL: import.meta.env.VITE_API_URL` e timeout curto. `src/api/desenhosApi.js` expõe apenas `listarDesenhos()` e `criarDesenho(desenho)`.

- **Por quê**: centraliza cabeçalhos, timeout e endereço; componentes não conhecem URL nem axios.
- **Alternativa descartada**: `fetch` nativo (o grupo optou por Axios) e URLs espalhadas nos componentes (dificultaria a migração para o back-end próprio).
- **Contrato**: `GET /desenhos` devolve `Desenho[]`; `POST /desenhos` recebe o desenho sem `id` e devolve o desenho criado com `id`.
- **Configuração**: `.env` versionado como `.env.example` com `VITE_API_URL=http://localhost:3001`. O `.env` real fica fora do Git. O cliente lê `import.meta.env?.VITE_API_URL` (com `?.` para permitir a verificação do módulo no Node) e mantém `http://localhost:3001` apenas como fallback para não quebrar quando o `.env` estiver ausente.

### 2. `json-server` como fonte de dados temporária

`db.json` na raiz contém `{ "desenhos": [] }` com dois ou três registros de exemplo. Script `server` sobe o mock na porta 3001; o Vite roda em outro terminal, para não adicionar `concurrently` ou `npm-run-all` (bibliotecas não aprovadas).

- **Por quê**: gera `id` automaticamente, responde CORS por padrão e simula um back-end real com HTTP de verdade.
- **Alternativa descartada**: array em memória ou `fetch` de um JSON estático — não exercitaria `POST` nem erro de rede com fidelidade.
- **Versão**: `json-server@0.17.4`, fixada por ter flags estáveis (`--watch`, `--port`) e não exigir configuração adicional.
- **Migração**: o back-end próprio deve responder aos mesmos dois endpoints com o mesmo formato; a troca é apenas `VITE_API_URL`.

### 3. Página única com listagem e formulário lado a lado

`src/pages/CatalogoDesenhos.jsx` concentra o estado da tela: `desenhos`, `carregando`, `erroListagem`, `enviando`, `erroCadastro`, `sucesso` e `valores` do formulário.

- **Por quê**: o requisito é uma funcionalidade completa, não navegação; evita `react-router` (biblioteca não aprovada).
- **Alternativa descartada**: rotas separadas para lista e cadastro.

### 4. Estado local com `useState` e `useEffect`, sem estado global

A página busca os desenhos na montagem por meio de uma função `carregarDesenhos()` reutilizada pelo botão "Tentar novamente". Após um cadastro bem-sucedido, o desenho devolvido pela API é acrescentado ao estado `desenhos` sem nova requisição.

- **Por quê**: um único consumidor de dados no ciclo; Context/Redux seriam complexidade sem retorno.
- **Consequência**: a função de recarga precisa limpar `erroListagem` antes de nova tentativa, para que os cenários de nova tentativa bem-sucedida e malsucedida sejam observáveis.

### 5. Validação em função pura, sem biblioteca de formulários

`src/components/validarDesenho.js` concentra as regras em uma função pura, e `src/components/DesenhoForm.jsx` mantém os valores do formulário e exibe as mensagens por campo. `validarDesenho(valores)` recebe strings e devolve `{ campo: mensagem }`.

- **Por quê**: a função pura pode ser verificada com `node` sem framework de testes, e as regras não ficam espalhadas pelo JSX.
- **Regras**: texto obrigatório após `trim`; ano inteiro entre 1900 e o ano corrente; sinopse com até 500 caracteres.
- **Campo de ano**: `input` do tipo `text` com `inputMode="numeric"`, para que um valor não numérico seja validado pela função em vez de ser descartado pelo navegador.
- **Mensagens** (texto acordado):
  - obrigatório: `"<Campo> é obrigatório."`
  - ano: `"Informe um ano entre 1900 e <ano atual>."`
  - sinopse: `"A sinopse deve ter no máximo 500 caracteres."`

### 6. Tratamento de erro explícito em duas operações

| Operação | Estado | Mensagem | Ação oferecida |
|---|---|---|---|
| Listagem | `erroListagem` | Não foi possível carregar os desenhos. | "Tentar novamente" |
| Cadastro | `erroCadastro` | Não foi possível cadastrar o desenho. | Reenviar mantendo os dados |

- **Por quê**: o erro da listagem é o comportamento obrigatório do ciclo; o erro de cadastro é uma suposição de escopo adicionada por simetria, porque uma falha de `POST` não pode parecer sucesso (ver `spec.md`).
- **Como o erro é detectado**: `try/catch` em torno das chamadas Axios; qualquer rejeição (rede, timeout, status fora de 2xx) é tratada como falha.
- **Limpeza do feedback de cadastro**: toda nova tentativa de envio limpa `sucesso` e `erroCadastro`. Como o `DesenhoForm` não chama `onCadastrar` quando a validação falha, a página escuta o `submit` em um wrapper (`onSubmitCapture`) em vez de alterar o contrato `onCadastrar`/`enviando` do formulário. Encontrado na validação da tarefa 6.3: sucesso seguido de envio inválido mantinha "Desenho cadastrado com sucesso" na tela.

### 7. Divisão das tarefas por arquivo para evitar conflito

Cada integrante possui arquivos exclusivos; apenas a integração final toca `App.jsx` e `App.css`.

```text
Alexandre   package.json, db.json, .env.example, .gitignore
Mauro       src/api/apiClient.js, src/api/desenhosApi.js
Joao        src/components/DesenhoList.jsx
Tiago       src/components/DesenhoForm.jsx, src/components/validarDesenho.js
Claudiana   src/components/Feedback.jsx
Lesley      src/pages/CatalogoDesenhos.jsx, src/App.jsx
```

Contratos de props acordados:

| Componente | Props |
|---|---|
| `DesenhoList` | `desenhos: Desenho[]` |
| `DesenhoForm` | `onCadastrar(payload) => Promise<boolean>`, `enviando: boolean` |
| `Feedback` | `tipo: 'carregando' \| 'erro' \| 'vazio' \| 'sucesso'`, `mensagem: string`, `onRetry?: () => void` |

`onCadastrar` devolve `true` apenas quando a API confirma o cadastro; o formulário só limpa os campos nesse caso.

### 8. Versionamento Git

Inicializar o repositório nesta pasta, commitar o template atual como base e depois commitar os artefatos do ciclo junto ao código.

- **Por quê**: requisito explícito de artefatos versionados.
- **Cuidado**: `node_modules`, `dist` e `.env` já estão cobertos ou precisam ser adicionados ao `.gitignore`; confirmar que `.env` não entre no primeiro commit.

### 9. Remoção dos arquivos do template Vite

O template inicial é substituído por conteúdo próprio: `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` e `public/icons.svg` são removidos; `src/index.css`, `src/App.css`, `index.html`, `public/favicon.svg` e `README.md` são reescritos para o catálogo.

- **Por quê**: o pedido do grupo é não entregar arquivos de template pré-prontos, e os assets antigos só existiam para a tela de exemplo do Vite.
- **Consequência**: nenhum arquivo restante pode referenciar os assets removidos; `index.html` mantém um favicon próprio para não gerar requisição 404.

## Risks / Trade-offs

- [A pasta ainda não é um repositório Git] → Inicializar antes do primeiro commit e verificar `.gitignore`; caso contrário o requisito de versionamento não é atendido.
- [Aluno depende de arquivo de outro] → A ordem de `tasks.md` respeita dependências e cada arquivo tem um dono único.
- [Divergência de nomes de props entre componentes] → O design fixa os contratos de props na seção 7 e em `tasks.md`.
- [`json-server` na porta 3001 indisponível ou ocupada] → Script npm dedicado, porta documentada e mensagem de erro prevista na interface.
- [Migração para back-end próprio quebrar o front] → Contrato de resposta fixado no item 1 e validado manualmente antes da troca.
- [Ambiente Windows com caminho contendo acentos e OneDrive] → Usar apenas caminhos relativos nos scripts e evitar arquivos com nome acentuado.
- [Ciclo sem testes automatizados] → Validação manual roteirizada (cenários de `spec.md`) + `npm run lint` + `npm run build`.

## Migration Plan

1. Subir o mock com `npm run server` e validar `GET /desenhos` e `POST /desenhos` fora do React.
2. Validar a aplicação com mock no ar (todos os cenários de sucesso).
3. Parar o mock e validar o cenário de erro e "Tentar novamente".
4. Para migrar ao back-end próprio: implementar os dois endpoints no mesmo contrato, apontar `VITE_API_URL` para o novo servidor e remover `db.json` e o script `server`.
5. Rollback: restaurar o valor anterior de `VITE_API_URL`; nenhum código de componente muda.
