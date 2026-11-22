# Tasks

Ordem de execução:

```text
1. validarDesenho.js -> 2. DesenhoForm.jsx -> 3. evidência visual -> 4. integração e entrega
```

Regras válidas para todas as tarefas:

- Não adicionar nenhuma biblioteca.
- Não chamar a API e não importar `src/api`, `axios` ou `fetch`.
- Alterar apenas `src/components/validarDesenho.js` e `src/components/DesenhoForm.jsx`.
- O harness em `src/App.jsx` é temporário: guardar uma cópia do conteúdo atual, usar apenas para os prints e restaurar antes do commit.
- Rodar os comandos a partir da raiz do projeto.

## 1. Função de validação (Tiago)

**Objetivo:** concentrar as regras em uma função sem React e sem API, pronta para ser executada no Node.

- [x] 1.1 Criar `src/components/validarDesenho.js` com as constantes e a função abaixo (verificação: o arquivo não tem JSX e `grep -nE "react|src/api|axios|fetch" src/components/validarDesenho.js` não encontra nada).

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

O `Number.isInteger` é o que rejeita `20a5` (`Number('20a5')` é `NaN`) e `2.5` (`Number('2.5')` é decimal). O ano é lido como texto e convertido apenas na validação.

- [x] 1.2 Rodar os quatro casos principais com `node -e` (verificação: a saída tem três objetos com erro e um `{}` no final).

```powershell
node -e "import('./src/components/validarDesenho.js').then(({ validarDesenho }) => { console.log(validarDesenho({ titulo: ' ', genero: 'Ação', anoLancamento: '2005', criador: 'X', sinopse: '' })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '1800', criador: 'C', sinopse: '' })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '2005', criador: 'C', sinopse: 'a'.repeat(501) })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '2005', criador: 'C', sinopse: '' })); })"
```

Saída esperada (o ano acompanha o ano corrente; em 2026):

```text
{ titulo: 'Título é obrigatório.' }
{ anoLancamento: 'Informe um ano entre 1900 e 2026.' }
{ sinopse: 'A sinopse deve ter no máximo 500 caracteres.' }
{}
```

- [x] 1.3 Conferir os casos de borda com a tabela abaixo (verificação: cada entrada produz exatamente o resultado indicado).

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Ano não numérico | `anoLancamento: '20a5'` | erro em `anoLancamento` com a mensagem do intervalo |
| Ano decimal | `anoLancamento: '2.5'` | erro em `anoLancamento` com a mensagem do intervalo |
| Ano vazio | `anoLancamento: ''` | `Ano de lançamento é obrigatório.` |
| Ano no mínimo | `anoLancamento: '1900'` | sem erro em `anoLancamento` |
| Ano no máximo | `anoLancamento: String(new Date().getFullYear())` | sem erro em `anoLancamento` |
| Sinopse vazia | `sinopse: ''` | sem erro em `sinopse` |
| Sinopse no limite | `sinopse: 'a'.repeat(500)` | sem erro em `sinopse` |
| Sinopse acima do limite | `sinopse: 'a'.repeat(501)` | erro em `sinopse` |
| Tudo válido | campos preenchidos | `{}` |

## 2. Formulário controlado (Tiago)

**Objetivo:** exibir os cinco campos, mostrar as mensagens por campo e bloquear o envio inválido, sem conhecer a API.

- [x] 2.1 Criar `src/components/DesenhoForm.jsx` com o código abaixo (verificação: `npm run lint` não aponta erro no arquivo e o formulário aparece no harness da tarefa 3.1).

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

- [x] 2.2 Conferir o contrato de props (verificação: o componente declara `onCadastrar` e `enviando`, e não importa nada de `src/api`).

| Prop | Tipo | Comportamento |
|---|---|---|
| `onCadastrar(payload)` | `Function` assíncrona | recebe o payload normalizado; resolve `true` em sucesso e `false` em falha |
| `enviando` | `boolean` | desabilita o botão e exibe `Cadastrando...` |

- [x] 2.3 Conferir o bloqueio de envio inválido (verificação: o `return` acontece antes de qualquer chamada a `onCadastrar`).

```js
const encontrados = validarDesenho(valores)
if (Object.keys(encontrados).length > 0) {
  setErros(encontrados)
  return
}
```

- [x] 2.4 Conferir a limpeza apenas em sucesso (verificação: `setValores(VALORES_INICIAIS)` e `setErros({})` estão dentro de `if (cadastrou)`).

```js
if (cadastrou) {
  setValores(VALORES_INICIAIS)
  setErros({})
}
```

- [x] 2.5 Conferir os atributos que sustentam as decisões (verificação: `noValidate` no `<form>`, `inputMode="numeric"` no campo de ano, `disabled={enviando}` no botão e `className="erro-campo"` nas mensagens).

## 3. Evidência visual com harness temporário

**Objetivo:** ver o formulário e as mensagens antes da página do exercício 06.

- [x] 3.1 Guardar uma cópia do conteúdo atual de `src/App.jsx` e substituí-lo temporariamente pelo harness abaixo (verificação: `npm run dev` mostra o formulário de cadastro).

```jsx
import { useState } from 'react'
import DesenhoForm from './components/DesenhoForm.jsx'

export default function App() {
  const [enviando, setEnviando] = useState(false)

  async function onCadastrar(payload) {
    setEnviando(true)
    console.log('payload recebido:', payload)
    await new Promise((resolver) => setTimeout(resolver, 600))
    setEnviando(false)
    return true
  }

  return <DesenhoForm onCadastrar={onCadastrar} enviando={enviando} />
}
```

- [x] 3.2 Testar os cenários abaixo com `npm run dev` (verificação: cada linha se comporta como indicado).

| Cenário | Ação | Resultado esperado |
|---|---|---|
| Formulário vazio | clicar em "Cadastrar desenho" | quatro mensagens de obrigatoriedade; nada no console |
| Ano abaixo do mínimo | preencher tudo e usar `1800` | mensagem do intervalo |
| Ano não numérico | usar `20a5` | mensagem do intervalo |
| Sinopse longa | usar 501 caracteres | mensagem do limite |
| Envio válido | preencher tudo e enviar | `payload recebido` com textos aparados e ano numérico; campos limpos |
| Envio recusado | trocar o retorno do stub para `false` | campos preservados e nenhuma limpeza |
| Envio em andamento | observar durante os 600 ms | botão desabilitado com `Cadastrando...` |

- [x] 3.3 Restaurar `src/App.jsx` exatamente como estava antes do harness (verificação: `git diff -- src/App.jsx` não mostra o harness).

- [x] 3.4 Registrar os prints do formulário com erros e de um envio válido para a entrega (verificação: as evidências estão anexadas à entrega).

## 4. Integração e entrega

- [x] 4.1 Rodar o lint (verificação: termina sem erros).

```powershell
cmd /c "npm run lint"
```

- [x] 4.2 Rodar o build (verificação: termina com sucesso).

```powershell
cmd /c "npm run build"
```

- [x] 4.3 Conferir a ausência de acoplamento com a API (verificação: o comando não imprime nenhuma linha).

```powershell
grep -nE "src/api|axios|fetch" src/components/validarDesenho.js src/components/DesenhoForm.jsx
```

- [x] 4.4 Percorrer a checklist do exercício (verificação: todos os itens abaixo marcados).

```text
[ ] validarDesenho não importa React
[ ] Campos obrigatórios usam trim
[ ] Ano validado como inteiro no intervalo
[ ] Sinopse limitada a 500 caracteres
[ ] Envio inválido não chama onCadastrar
[ ] Campos só são limpos quando a resposta é true
[ ] Botão desabilitado durante o envio
[ ] Nenhum import de src/api, axios ou fetch
[ ] npm run lint sem erros
[ ] npm run build conclui
[ ] Prints e saída do Node registrados
[ ] src/App.jsx restaurado
```

- [x] 4.5 Validar os artefatos OpenSpec (verificação: a mudança é válida).

```powershell
npx --yes @fission-ai/openspec@2.1.1 validate formulario-validacao-desenho --strict
```

- [x] 4.6 Commitar a entrega, se o grupo estiver commitando por exercício (verificação: o commit inclui apenas os dois arquivos e o change; o harness não aparece).

```powershell
git add src/components/validarDesenho.js src/components/DesenhoForm.jsx openspec/changes/formulario-validacao-desenho
git status
git commit -m "feat: validacao e formulario de cadastro de desenhos"
```

- [ ] 4.7 Avisar o responsável do exercício 06 que o contrato `onCadastrar(payload) => Promise<boolean>` e `enviando` está pronto para a integração (verificação: o contrato foi comunicado e registrado no grupo).

## Workflow follow-up

- Após a revisão do grupo, arquivar o change com `/opsx-archive` e reconciliar os requisitos com o change guarda-chuva `catalogo-desenhos`.
- Verificar o resultado arquivado.
