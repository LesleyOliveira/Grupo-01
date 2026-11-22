# Catálogo de Desenhos Animados

Aplicação React + Vite para listar e cadastrar desenhos animados. Os dados vêm de uma API HTTP, que neste ciclo é simulada com `json-server`. A troca por um back-end próprio exige apenas alterar `VITE_API_URL`.

Funcionalidades:

- listagem dos desenhos (título, gênero, ano de lançamento, criador e sinopse);
- cadastro com validação no cliente (campos obrigatórios, ano entre 1900 e o ano atual, sinopse com até 500 caracteres);
- estados de carregamento, lista vazia, sucesso e erro, com "Tentar novamente" quando a listagem falha.

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
```

Em um terminal, suba o mock da API (porta 3001):

```bash
npm run server
```

Em outro terminal, suba a aplicação:

```bash
npm run dev
```

Opcional: crie um `.env` a partir de `.env.example` para definir `VITE_API_URL`. Sem `.env`, a aplicação usa `http://localhost:3001`.

Verificações:

```bash
npm run lint
npm run build
```

## Estrutura

```text
db.json                        dados do mock (json-server)
src/
  api/
    apiClient.js               instância Axios configurada por VITE_API_URL
    desenhosApi.js             listarDesenhos() e criarDesenho()
  components/
    DesenhoList.jsx            lista de desenhos (apresentação)
    DesenhoForm.jsx            formulário controlado de cadastro
    validarDesenho.js          regras de validação (função pura)
    Feedback.jsx               carregamento, erro, vazio e sucesso
  pages/
    CatalogoDesenhos.jsx       página: estado da tela e integração
  App.jsx                      renderiza a página do catálogo
openspec/                      proposta, specs, design e tarefas do ciclo
docs/exercicios/               roteiro de cada integrante
```

## Divisão de tarefas

| # | Integrante | Entrega |
|---|---|---|
| 1 | Alexandre | Repositório, dependências, `db.json`, script `server` e `.env.example` |
| 2 | Mauro | Camada de API (`apiClient.js`, `desenhosApi.js`) |
| 3 | João | Componente de listagem (`DesenhoList.jsx`) |
| 4 | Tiago | Formulário e validação (`DesenhoForm.jsx`, `validarDesenho.js`) |
| 5 | Claudiana | Componente de feedback (`Feedback.jsx`) |
| 6 | Lesley | Página, layout e validação final (`CatalogoDesenhos.jsx`, `App.jsx`, `App.css`) |

O ciclo é conduzido com OpenSpec. Veja `openspec/changes/catalogo-desenhos/`.
