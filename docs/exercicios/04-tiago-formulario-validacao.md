# Exercício 04 — Formulário de cadastro e validação

**Integrante:** Tiago
**Ciclo:** `catalogo-desenhos`
**Tempo estimado:** 90 minutos
**Depende de:** exercício 01 concluído
**É usado por:** exercício 06

---

## 1. Contexto

Validar dados apenas no servidor gasta requisição e faz o usuário esperar por um erro previsível. A validação no cliente precisa bloquear o envio antes da chamada HTTP, indicar exatamente qual campo está errado e não impedir um cadastro válido.

Seu exercício tem duas partes: uma função pura com as regras e um formulário controlado que exibe as mensagens.

---

## 2. Objetivos de aprendizagem

- escrever validação como função pura, separada da interface;
- controlar campos de formulário com estado do React;
- lidar com campo numérico que chega como texto;
- normalizar dados antes de enviar à API;
- testar regras de negócio sem framework de testes.

---

## 3. Pré-requisitos

- exercício 01 concluído;
- leitura de `openspec/changes/catalogo-desenhos/specs/catalogo-desenhos/spec.md`, requisitos de validação.

---

## 4. Arquivos sob sua responsabilidade

```text
src/components/validarDesenho.js
src/components/DesenhoForm.jsx
```

Você não deve chamar a API. O formulário avisa a página por meio da prop `onCadastrar`, implementada no exercício 06.

---

## 5. Enunciado

### Regras acordadas

| Campo | Regra | Mensagem |
|---|---|---|
| `titulo` | obrigatório, não pode ser só espaços | `Título é obrigatório.` |
| `genero` | obrigatório | `Gênero é obrigatório.` |
| `criador` | obrigatório | `Criador é obrigatório.` |
| `anoLancamento` | obrigatório, inteiro entre 1900 e o ano atual | `Informe um ano entre 1900 e <ano atual>.` |
| `sinopse` | opcional, até 500 caracteres | `A sinopse deve ter no máximo 500 caracteres.` |

### Contrato do componente

| Prop | Tipo | Comportamento |
|---|---|---|
| `onCadastrar(payload)` | `Function` assíncrona | devolve `true` em sucesso e `false` em falha |
| `enviando` | `boolean` | desabilita o botão enquanto a requisição corre |

O formulário só limpa os campos quando `onCadastrar` devolve `true`.

---

## 6. Etapas

### Etapa 1 — Função de validação

`src/components/validarDesenho.js`:

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

Por que `Number.isInteger`: `Number('20a5')` resulta em `NaN`, e `Number('2.5')` resulta em `2.5`. Nos dois casos o ano deve ser rejeitado.

### Etapa 2 — Formulário controlado

`src/components/DesenhoForm.jsx`:

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

### Etapa 3 — Justificar três decisões

1. **`noValidate`**: desliga a validação nativa do navegador para que as mensagens do grupo apareçam de forma consistente e em português.
2. **`inputMode="numeric"` com `type` de texto**: se fosse `type="number"`, o navegador descartaria `20a5` e o campo chegaria vazio. Mantendo texto, a regra "ano não numérico" fica testável.
3. **`alterar` limpa o erro do campo**: ao digitar novamente, a mensagem antiga some, evitando que o usuário corrija e continue vendo o erro anterior.

---

## 7. Comandos para executar

Teste as regras com Node, sem navegador:

```powershell
node -e "import('./src/components/validarDesenho.js').then(({ validarDesenho }) => { console.log(validarDesenho({ titulo: ' ', genero: 'Ação', anoLancamento: '2005', criador: 'X', sinopse: '' })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '1800', criador: 'C', sinopse: '' })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '2005', criador: 'C', sinopse: 'a'.repeat(501) })); console.log(validarDesenho({ titulo: 'A', genero: 'B', anoLancamento: '2005', criador: 'C', sinopse: '' })); })"
```

Verificação estática:

```powershell
cmd /c "npm run lint"
cmd /c "npm run build"
```

---

## 8. Resultado esperado

Saída do comando Node:

```text
{ titulo: 'Título é obrigatório.' }
{ anoLancamento: 'Informe um ano entre 1900 e 2026.' }
{ sinopse: 'A sinopse deve ter no máximo 500 caracteres.' }
{}
```

O último objeto vazio significa: formulário válido, envio liberado.

---

## 9. Casos de validação

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Título em branco | `'   '` | erro em `titulo` |
| Ano abaixo do mínimo | `1800` | erro em `anoLancamento` |
| Ano acima do atual | `3000` | erro em `anoLancamento` |
| Ano não numérico | `20a5` | erro em `anoLancamento` |
| Sinopse longa | 501 caracteres | erro em `sinopse` |
| Sinopse vazia | `''` | sem erro |
| Tudo válido | campos preenchidos | `{}` |
| Envio inválido | clicar em enviar com erro | `onCadastrar` não é chamado |

---

## 10. Evidências para entrega

1. Print da saída do comando Node com os quatro resultados.
2. Print do formulário com as mensagens de erro.
3. Print de um envio válido (a integração completa é no exercício 06).
4. Saída de `npm run lint` e `npm run build`.

---

## 11. Critérios de avaliação

| Critério | Peso |
|---|---|
| Validação separada em função pura | 2,0 |
| Regras de obrigatoriedade corretas | 2,0 |
| Regra do ano (intervalo e não numérico) | 2,0 |
| Limite da sinopse | 1,5 |
| Formulário controlado e bloqueio de envio | 1,5 |
| Limpeza apenas em sucesso | 1,0 |

---

## 12. Checklist

- [ ] `validarDesenho` não importa React
- [ ] Campos obrigatórios usam `trim`
- [ ] Ano validado como inteiro no intervalo
- [ ] Sinopse limitada a 500 caracteres
- [ ] Envio inválido não chama `onCadastrar`
- [ ] Campos só são limpos quando a resposta é `true`
- [ ] Botão desabilitado durante o envio

---

## 13. Referência

Gabarito: `src/components/validarDesenho.js` e `src/components/DesenhoForm.jsx`.
