# Tasks

Ordem de execução e dependências:

```text
1. Alexandre  ->  2. Mauro  ->  3/4/5 (Joao, Tiago, Claudiana em paralelo)  ->  6. Lesley  ->  7. Grupo
```

Regras que valem para todas as tarefas:

- Não adicionar nenhuma biblioteca. Aprovadas: `axios` e `json-server`.
- Rodar os comandos a partir da raiz do projeto.
- Cada integrante altera apenas os arquivos sob sua responsabilidade. `App.jsx`, `App.css` e `package.json` só mudam nas tarefas indicadas.
- Se algo não funcionar como descrito aqui, o acordo deve ser atualizado neste arquivo antes de mudar a abordagem.

## 1. Fundação do projeto e mock HTTP (Alexandre)

**Objetivo:** deixar o repositório versionado, com dependências instaladas, mock `json-server` e configuração de ambiente pronta para os demais integrantes.

- [x] 1.1 Inicializar o repositório Git, criar o primeiro commit do template atual e ignorar `.env` (verificação: `git log --oneline` mostra um commit e `git status` não lista `.env`).

```powershell
git init
```

Adicione ao final de `.gitignore`:

```text
.env
```

Depois:

```powershell
git add .
git commit -m "chore: template React + Vite inicial"
```

- [x] 1.2 Instalar `axios` e `json-server@0.17.4` (verificação: `package.json` lista `axios` em `dependencies` e `json-server` em `devDependencies`, e `npm ls axios json-server` termina sem erro).

```powershell
npm install axios
npm install -D json-server@0.17.4
```

A versão do `json-server` é fixada porque a 0.17.4 usa as flags `--watch` e `--port` documentadas nesta tarefa.

- [x] 1.3 Criar `db.json` na raiz com a coleção `desenhos` e dois registros de exemplo (verificação: o arquivo é JSON válido e contém `desenhos` como array).

```json
{
  "desenhos": [
    {
      "id": 1,
      "titulo": "Avatar: A Lenda de Aang",
      "genero": "Aventura",
      "anoLancamento": 2005,
      "criador": "Michael Dante DiMartino e Bryan Konietzko",
      "sinopse": "Aang, o último dobrador de ar, precisa dominar os quatro elementos para deter a Nação do Fogo."
    },
    {
      "id": 2,
      "titulo": "As Meninas Superpoderosas",
      "genero": "Ação",
      "anoLancamento": 1998,
      "criador": "Craig McCracken",
      "sinopse": ""
    }
  ]
}
```

O segundo registro tem `sinopse` vazia de propósito: serve para validar que a listagem não quebra nem exibe espaço vazio.

- [x] 1.4 Adicionar o script `server` em `package.json` (verificação: `npm run server` inicia o mock e mostra a porta 3001).

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "oxlint",
  "preview": "vite preview",
  "server": "json-server --watch db.json --port 3001"
}
```

- [x] 1.5 Criar `.env` e `.env.example` com a URL da API (verificação: `npm run server` e, em outro terminal, a aplicação conseguirá ler `VITE_API_URL`; `.env` não aparece em `git status`).

```text
VITE_API_URL=http://localhost:3001
```

Repita o mesmo conteúdo em `.env.example`, que é o arquivo versionado.

- [x] 1.6 Verificar o mock com requisições HTTP reais (verificação: `GET` devolve os dois registros e `POST` devolve um objeto com `id`).

Com `npm run server` em um terminal, em outro:

```powershell
curl.exe http://localhost:3001/desenhos
curl.exe -X POST http://localhost:3001/desenhos -H "Content-Type: application/json" -d "{\"titulo\":\"Teste de contrato\",\"genero\":\"Teste\",\"anoLancamento\":2020,\"criador\":\"Teste\",\"sinopse\":\"\"}"
```

Após confirmar o `POST`, remova o registro "Teste de contrato" de `db.json`. O `json-server` grava o novo item no arquivo.

## 2. Camada de acesso à API (Mauro)

**Objetivo:** isolar Axios e o endereço da API, de modo que a troca do mock por um back-end próprio não altere componentes nem páginas.

- [x] 2.1 Criar `src/api/apiClient.js` com instância Axios apontando para `VITE_API_URL` (verificação: `npm run lint` sem erros e nenhuma URL `localhost` fora deste arquivo).

```js
import axios from 'axios'

const baseURL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})
```

O `?.` em `import.meta.env` permite importar este módulo no Node para verificação. O timeout de 5 s evita que a tela fique carregando para sempre quando o mock estiver desligado.

- [x] 2.2 Criar `src/api/desenhosApi.js` com `listarDesenhos` e `criarDesenho` (verificação: os dois nomes são exportados e os componentes importam apenas deste módulo, nunca de `apiClient`).

```js
import { apiClient } from './apiClient.js'

export async function listarDesenhos() {
  const { data } = await apiClient.get('/desenhos')
  return data
}

export async function criarDesenho(desenho) {
  const { data } = await apiClient.post('/desenhos', desenho)
  return data
}
```

Contrato acordado com o mock e com o futuro back-end: `GET /desenhos` responde uma lista e `POST /desenhos` responde o desenho criado, já com `id`. O `id` não é enviado pelo formulário.

- [x] 2.3 Verificar o módulo contra o mock em execução (verificação: o comando abaixo imprime `total: 2` e `criado id: <número>`).

Com `npm run server` ativo:

```powershell
node -e "import('./src/api/desenhosApi.js').then(async (api) => { const lista = await api.listarDesenhos(); console.log('total:', lista.length); const novo = await api.criarDesenho({ titulo: 'Teste de contrato', genero: 'Teste', anoLancamento: 2020, criador: 'Teste', sinopse: '' }); console.log('criado id:', novo.id) }).catch((e) => { console.error(e.message); process.exit(1) })"
```

Remova o registro "Teste de contrato" de `db.json` depois da verificação. Com o servidor desligado, o mesmo comando deve falhar com erro de conexão — esse é o comportamento esperado e a base do cenário de erro da listagem.

## 3. Componente de listagem (João)

**Objetivo:** exibir os desenhos recebidos por props, sem buscar dados nem conhecer Axios.

- [x] 3.1 Criar `src/components/DesenhoList.jsx` (verificação: `npm run lint` e `npm run build` terminam sem erro; o componente não importa nada de `src/api`).

```jsx
export default function DesenhoList({ desenhos }) {
  return (
    <ul className="desenho-list">
      {desenhos.map((desenho) => (
        <li key={desenho.id} className="desenho-card">
          <h3>{desenho.titulo}</h3>
          <p className="desenho-meta">
            {desenho.genero} - {desenho.anoLancamento} - {desenho.criador}
          </p>
          {desenho.sinopse ? <p>{desenho.sinopse}</p> : null}
        </li>
      ))}
    </ul>
  )
}
```

- [x] 3.2 Conferir os cenários da spec que dependem deste componente (verificação: com os dois registros do `db.json`, a listagem mostra título, gênero, ano e criador em ambos, e a sinopse apenas no primeiro).

Registre no PR/commit o resultado da conferência. A verificação visual completa acontece na tarefa 6.3, já com a página integrada.

## 4. Formulário e validação (Tiago)

**Objetivo:** impedir o envio de dados inválidos e entregar ao restante da aplicação um payload já normalizado.

- [x] 4.1 Criar `src/components/validarDesenho.js` (verificação: `npm run lint` sem erros e arquivo sem JSX, pronto para execução no Node).

```js
const ANO_MINIMO = 1900
const LIMITE_SINOPSE = 500

export function validarDesenho(valores) {
  const erros = {}
  const anoAtual = new Date().getFullYear()

  if (!valores.titulo?.trim()) {
    erros.titulo = 'Título é obrigatório.'
  }
  if (!valores.genero?.trim()) {
    erros.genero = 'Gênero é obrigatório.'
  }
  if (!valores.criador?.trim()) {
    erros.criador = 'Criador é obrigatório.'
  }

  const anoTexto = String(valores.anoLancamento ?? '').trim()
  const ano = Number(anoTexto)

  if (!anoTexto) {
    erros.anoLancamento = 'Ano de lançamento é obrigatório.'
  } else if (!Number.isInteger(ano) || ano < ANO_MINIMO || ano > anoAtual) {
    erros.anoLancamento = `Informe um ano entre ${ANO_MINIMO} e ${anoAtual}.`
  }

  if ((valores.sinopse ?? '').trim().length > LIMITE_SINOPSE) {
    erros.sinopse = `A sinopse deve ter no máximo ${LIMITE_SINOPSE} caracteres.`
  }

  return erros
}
```

O ano é tratado como texto no formulário e convertido apenas na validação. Isso permite distinguir "vazio", "não numérico" e "fora do intervalo", como a spec exige.

- [x] 4.2 Verificar as regras com casos reais (verificação: o comando abaixo imprime três objetos com erro e um objeto vazio `{}` no último caso).

```powershell
node -e "import('./src/components/validarDesenho.js').then(({ validarDesenho }) => { console.log(validarDesenho({ titulo: ' ', genero: 'Ação', anoLancamento: '2005', criador: 'X', sinopse: '' })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '1800', criador: 'C', sinopse: '' })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '2005', criador: 'C', sinopse: 'a'.repeat(501) })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '2005', criador: 'C', sinopse: '' })); })"
```

- [x] 4.3 Criar `src/components/DesenhoForm.jsx` com os cinco campos, mensagens por campo e bloqueio durante o envio (verificação: `npm run build` sem erros e nenhum `fetch`/axios no arquivo).

```jsx
import { useState } from 'react'
import { validarDesenho } from './validarDesenho.js'

const VALORES_INICIAIS = {
  titulo: '',
  genero: '',
  anoLancamento: '',
  criador: '',
  sinopse: '',
}

export default function DesenhoForm({ onCadastrar, enviando }) {
  const [valores, setValores] = useState(VALORES_INICIAIS)
  const [erros, setErros] = useState({})

  function alterar(campo, valor) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }))
    setErros((atuais) => ({ ...atuais, [campo]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()

    const encontrados = validarDesenho(valores)
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados)
      return
    }

    const cadastrou = await onCadastrar({
      titulo: valores.titulo.trim(),
      genero: valores.genero.trim(),
      anoLancamento: Number(valores.anoLancamento),
      criador: valores.criador.trim(),
      sinopse: valores.sinopse.trim(),
    })

    if (cadastrou) {
      setValores(VALORES_INICIAIS)
      setErros({})
    }
  }

  return (
    <form className="desenho-form" onSubmit={enviar} noValidate>
      <label>
        Título
        <input
          name="titulo"
          value={valores.titulo}
          onChange={(e) => alterar('titulo', e.target.value)}
        />
        {erros.titulo ? <span className="erro-campo">{erros.titulo}</span> : null}
      </label>

      <label>
        Gênero
        <input
          name="genero"
          value={valores.genero}
          onChange={(e) => alterar('genero', e.target.value)}
        />
        {erros.genero ? <span className="erro-campo">{erros.genero}</span> : null}
      </label>

      <label>
        Ano de lançamento
        <input
          name="anoLancamento"
          inputMode="numeric"
          value={valores.anoLancamento}
          onChange={(e) => alterar('anoLancamento', e.target.value)}
        />
        {erros.anoLancamento ? (
          <span className="erro-campo">{erros.anoLancamento}</span>
        ) : null}
      </label>

      <label>
        Criador
        <input
          name="criador"
          value={valores.criador}
          onChange={(e) => alterar('criador', e.target.value)}
        />
        {erros.criador ? <span className="erro-campo">{erros.criador}</span> : null}
      </label>

      <label>
        Sinopse (opcional)
        <textarea
          name="sinopse"
          rows="4"
          value={valores.sinopse}
          onChange={(e) => alterar('sinopse', e.target.value)}
        />
        {erros.sinopse ? <span className="erro-campo">{erros.sinopse}</span> : null}
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Cadastrando...' : 'Cadastrar desenho'}
      </button>
    </form>
  )
}
```

- [x] 4.4 Revisar o componente contra a spec (verificação: o `if` que verifica `validarDesenho` retorna antes de chamar `onCadastrar`, e o arquivo não importa nada de `src/api`).

A verificação visual das mensagens por campo acontece na tarefa 6.3, com a página integrada.

## 5. Componente de feedback e estados (Claudiana)

**Objetivo:** concentrar carregamento, erro com nova tentativa, lista vazia e sucesso em um único componente previsível.

- [x] 5.1 Criar `src/components/Feedback.jsx` (verificação: `npm run lint` e `npm run build` sem erros; o botão "Tentar novamente" aparece apenas em `tipo === 'erro'` com `onRetry`).

```jsx
export default function Feedback({ tipo, mensagem, onRetry }) {
  const papel = tipo === 'erro' ? 'alert' : 'status'

  return (
    <div className={`feedback feedback-${tipo}`} role={papel}>
      <p>{mensagem}</p>
      {tipo === 'erro' && onRetry ? (
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
```

- [x] 5.2 Conferir os quatro estados exigidos pela spec (verificação: revisar o componente e confirmar que `carregando`, `erro`, `vazio` e `sucesso` produzem textos distintos e que só `erro` habilita a nova tentativa).

Textos acordados: `Carregando desenhos...`, `Não foi possível carregar os desenhos.`, `Nenhum desenho encontrado.` e `Desenho cadastrado com sucesso`. O botão de nova tentativa é o único caminho de repetição da listagem.

## 6. Página, integração visual e fluxo completo (Lesley)

**Objetivo:** unir os componentes, controlar o estado da tela e executar os fluxos reais contra o mock.

- [x] 6.1 Criar `src/pages/CatalogoDesenhos.jsx` com busca inicial, recarga, cadastro e os estados da tela (verificação: `npm run lint` e `npm run build` sem erros).

```jsx
import { useCallback, useEffect, useState } from 'react'
import DesenhoForm from '../components/DesenhoForm.jsx'
import DesenhoList from '../components/DesenhoList.jsx'
import Feedback from '../components/Feedback.jsx'
import { criarDesenho, listarDesenhos } from '../api/desenhosApi.js'

export default function CatalogoDesenhos() {
  const [desenhos, setDesenhos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroListagem, setErroListagem] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const carregarDesenhos = useCallback(async () => {
    setCarregando(true)
    setErroListagem(null)
    try {
      const lista = await listarDesenhos()
      setDesenhos(lista)
    } catch {
      setErroListagem('Não foi possível carregar os desenhos.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarDesenhos()
  }, [carregarDesenhos])

  async function cadastrar(payload) {
    setEnviando(true)
    setErroCadastro(null)
    setSucesso(false)
    try {
      const criado = await criarDesenho(payload)
      setDesenhos((atuais) => [...atuais, criado])
      setSucesso(true)
      return true
    } catch {
      setErroCadastro('Não foi possível cadastrar o desenho.')
      return false
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="catalogo">
      <h1>Catálogo de Desenhos Animados</h1>

      <div className="catalogo-conteudo">
        <section aria-label="Desenhos cadastrados">
          <h2>Desenhos</h2>

          {carregando ? (
            <Feedback tipo="carregando" mensagem="Carregando desenhos..." />
          ) : null}

          {!carregando && erroListagem ? (
            <Feedback
              tipo="erro"
              mensagem={erroListagem}
              onRetry={carregarDesenhos}
            />
          ) : null}

          {!carregando && !erroListagem && desenhos.length === 0 ? (
            <Feedback tipo="vazio" mensagem="Nenhum desenho encontrado." />
          ) : null}

          {!carregando && !erroListagem && desenhos.length > 0 ? (
            <DesenhoList desenhos={desenhos} />
          ) : null}
        </section>

        <section aria-label="Cadastrar desenho">
          <h2>Novo desenho</h2>

          {sucesso ? (
            <Feedback tipo="sucesso" mensagem="Desenho cadastrado com sucesso" />
          ) : null}

          {erroCadastro ? (
            <Feedback tipo="erro" mensagem={erroCadastro} />
          ) : null}

          <DesenhoForm onCadastrar={cadastrar} enviando={enviando} />
        </section>
      </div>
    </main>
  )
}
```

O `carregarDesenhos` limpa `erroListagem` antes de cada tentativa, o que torna observáveis os dois cenários de nova tentativa da spec.

- [x] 6.2 Substituir `src/App.jsx`, `src/App.css` e `src/index.css`, reescrever `index.html` e `README.md` e remover os assets do template (`src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`), mantendo um favicon próprio em `public/favicon.svg` (verificação: `npm run dev` mostra apenas o catálogo e nenhum arquivo restante referencia os assets removidos).

```jsx
import CatalogoDesenhos from './pages/CatalogoDesenhos.jsx'
import './App.css'

function App() {
  return <CatalogoDesenhos />
}

export default App
```

Em `src/App.css`, remova os estilos do template e mantenha apenas o layout do catálogo, por exemplo:

```css
.catalogo {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}

.catalogo-conteudo {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .catalogo-conteudo {
    grid-template-columns: 3fr 2fr;
  }
}

.desenho-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.desenho-card {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 1rem;
}

.desenho-form label {
  display: block;
  margin-bottom: 0.75rem;
}

.desenho-form input,
.desenho-form textarea {
  display: block;
  width: 100%;
}

.erro-campo {
  color: #b00020;
  display: block;
  font-size: 0.875rem;
}

.feedback-erro {
  color: #b00020;
}
```

Em `src/index.css`, remova o tema do template e mantenha apenas a base tipográfica:

```css
:root {
  font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  color: #1f2330;
  background: #f7f7fb;
}

body {
  margin: 0;
  min-height: 100vh;
}

h1,
h2,
h3 {
  color: #12141c;
}

button {
  cursor: pointer;
}
```

Em `index.html`, ajuste idioma e título:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Catálogo de Desenhos Animados</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Remova os arquivos do template que não são mais usados:

```powershell
Remove-Item src/assets/hero.png, src/assets/react.svg, src/assets/vite.svg, public/icons.svg
Remove-Item src/assets
```

Substitua `public/favicon.svg` por um ícone próprio (uma televisão simples) e reescreva o `README.md` com a descrição do catálogo, os comandos `npm install`, `npm run server`, `npm run dev`, `npm run lint` e `npm run build`, a estrutura de pastas e a divisão de tarefas entre os seis integrantes.

- [x] 6.3 Validar os fluxos de sucesso com o mock no ar (verificação: os quatro cenários abaixo passam na interface).

```text
1) npm run server  (terminal 1)
2) npm run dev     (terminal 2)
3) abrir a URL indicada pelo Vite
```

- Listagem: os dois desenhos do `db.json` aparecem com título, gênero, ano e criador; a sinopse aparece só no primeiro.
- Cadastro válido: preencher os campos, enviar e ver "Desenho cadastrado com sucesso", formulário limpo e novo item na lista.
- Formulário inválido: enviar vazio e confirmar mensagens de título, gênero, ano e criador, sem requisição no DevTools.
- Ano inválido: informar `1800` e depois `20a5` e confirmar a mensagem do intervalo em ambos os casos.

- [x] 6.4 Validar os fluxos de erro (verificação: mensagem e nova tentativa se comportam como na spec).

Com a página aberta, pare o `npm run server` (Ctrl+C) e clique em "Tentar novamente":

- A mensagem "Não foi possível carregar os desenhos." e o botão "Tentar novamente" continuam visíveis.
- Religar o mock e clicar novamente em "Tentar novamente" substitui o erro pela listagem.
- Com o mock desligado, enviar um cadastro válido exibe "Não foi possível cadastrar o desenho." e mantém os valores digitados.

- [ ] 6.5 Limpar o feedback de cadastro a cada nova tentativa de envio (verificação: cadastrar com sucesso e, em seguida, enviar o formulário vazio; "Desenho cadastrado com sucesso" desaparece e só as mensagens de campo ficam visíveis).

Encontrado na validação da 6.3: o `DesenhoForm` não chama `onCadastrar` quando a validação falha, então a página não ficava sabendo da nova tentativa. A correção fica só na página, sem alterar o contrato do formulário (ver `design.md`, decisão 6):

```jsx
function limparFeedbackCadastro() {
  setSucesso(false)
  setErroCadastro(null)
}

// ...
<div onSubmitCapture={limparFeedbackCadastro}>
  <DesenhoForm onCadastrar={cadastrar} enviando={enviando} />
</div>
```

## 7. Fechamento do ciclo e versionamento (grupo, coordenação de Lesley)

**Objetivo:** garantir que os artefatos do framework e o código validado entram no Git juntos.

- [ ] 7.1 Validar os artefatos do OpenSpec (verificação: `openspec validate catalogo-desenhos --strict` responde que a mudança é válida).

```powershell
openspec validate catalogo-desenhos --strict
```

Se o PowerShell bloquear o comando por política de execução, use `cmd /c openspec.cmd validate catalogo-desenhos --strict`.

- [ ] 7.2 Rodar as verificações estáticas do projeto (verificação: os dois comandos terminam com sucesso).

```powershell
npm run lint
npm run build
```

- [ ] 7.3 Executar a checklist completa de cenários da spec com o mock ligado e desligado (verificação: todos os cenários de `specs/catalogo-desenhos/spec.md` foram observados ao menos uma vez).

A checklist cobre: lista preenchida, lista vazia (remover temporariamente os itens de `db.json`), carregamento, cadastro válido, campos obrigatórios, ano fora do intervalo, ano não numérico, sinopse vazia, sinopse acima de 500 caracteres, falha de listagem, nova tentativa bem-sucedida, nova tentativa malsucedida e falha de cadastro. Registre o resultado no commit.

- [ ] 7.4 Commitar código e artefatos do ciclo (verificação: `git log --oneline` mostra o commit e `git show --stat HEAD` inclui `openspec/changes/catalogo-desenhos/`).

```powershell
git add .
git status
git commit -m "feat: catalogo de desenhos com listagem, cadastro e tratamento de erro"
```

Confirme que `.env` e `node_modules` não aparecem em `git status` antes do commit.

## 8. Backlog fora deste ciclo

O próximo ciclo acordado pelo grupo é o cadastro de personagens vinculados a um desenho por `desenhoId`. Ele será aberto com `/opsx-propose` depois que este ciclo for archiveado, e não faz parte desta entrega.
