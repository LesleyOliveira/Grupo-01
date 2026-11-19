# Exercício 06 — Página, integração e validação final

**Integrante:** Lesley
**Ciclo:** `catalogo-desenhos`
**Tempo estimado:** 90 minutos
**Depende de:** exercícios 01 a 05 concluídos
**Entrega:** funcionalidade completa validada e commit final

---

## 1. Contexto

Cada integrante construiu uma peça: mock, camada HTTP, listagem, formulário e feedback. Falta o elemento que coordena tudo: a página. Ela decide quando buscar, guarda os estados da tela e traduz falhas da API em mensagens para o usuário.

Seu exercício é integrar os componentes, aplicar o layout e executar a validação final prevista na spec.

---

## 2. Objetivos de aprendizagem

- compor componentes em uma página;
- controlar estados de carregamento, erro, sucesso e envio;
- integrar `useEffect` com uma API assíncrona;
- evitar condições de corrida ao desmontar o componente;
- validar uma funcionalidade completa contra critérios de aceitação.

---

## 3. Pré-requisitos

- exercícios 01 a 05 concluídos e commits feitos;
- `npm run server` e `npm run dev` disponíveis;
- leitura de `specs/catalogo-desenhos/spec.md`.

---

## 4. Arquivos sob sua responsabilidade

```text
src/pages/CatalogoDesenhos.jsx
src/App.jsx
src/App.css
```

Ajustes de base em `src/index.css` e `index.html` também são seus. Não altere os componentes dos colegas; se encontrar um problema neles, registre e combine a correção com o responsável.

---

## 5. Enunciado

Monte a página do catálogo com duas seções: listagem e cadastro. A listagem deve buscar os dados ao abrir, exibir carregamento, lista vazia, erro com nova tentativa e a lista preenchida. O cadastro deve exibir sucesso ou erro e atualizar a listagem sem recarregar a página.

---

## 6. Etapas

### Etapa 1 — Criar a página

`src/pages/CatalogoDesenhos.jsx`:

```jsx
import { useEffect, useState } from 'react'
import DesenhoForm from '../components/DesenhoForm.jsx'
import DesenhoList from '../components/DesenhoList.jsx'
import Feedback from '../components/Feedback.jsx'
import { criarDesenho, listarDesenhos } from '../api/desenhosApi.js'

const MENSAGEM_ERRO_LISTAGEM = 'Não foi possível carregar os desenhos.'
const MENSAGEM_ERRO_CADASTRO = 'Não foi possível cadastrar o desenho.'

export default function CatalogoDesenhos() {
  const [desenhos, setDesenhos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroListagem, setErroListagem] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    let ativo = true

    listarDesenhos()
      .then((lista) => {
        if (ativo) {
          setDesenhos(lista)
        }
      })
      .catch(() => {
        if (ativo) {
          setErroListagem(MENSAGEM_ERRO_LISTAGEM)
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false)
        }
      })

    return () => {
      ativo = false
    }
  }, [])

  async function tentarNovamente() {
    setCarregando(true)
    setErroListagem(null)
    try {
      const lista = await listarDesenhos()
      setDesenhos(lista)
    } catch {
      setErroListagem(MENSAGEM_ERRO_LISTAGEM)
    } finally {
      setCarregando(false)
    }
  }

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
      setErroCadastro(MENSAGEM_ERRO_CADASTRO)
      return false
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="catalogo">
      <header className="catalogo-cabecalho">
        <h1>Catálogo de Desenhos Animados</h1>
        <p>Listagem e cadastro dos desenhos favoritos do grupo.</p>
      </header>

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
              onRetry={tentarNovamente}
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

### Etapa 2 — Explicar quatro decisões

1. **Flag `ativo` no efeito**: se a página for desmontada antes da resposta, o `setState` é ignorado. Evita o aviso de atualização em componente desmontado.
2. **`tentarNovamente` separada**: o botão precisa reexibir o carregamento e limpar o erro antes de buscar. O efeito inicial não deve piscar o indicador, porque `carregando` já começa `true`.
3. **Adicionar o criado ao estado**: a API devolve o registro com `id`; não é necessário refazer o `GET` para ver o item novo.
4. **Mensagens constantes**: os textos ficam em um único lugar e são idênticos aos da spec, evitando divergência entre interface e documento.

### Etapa 3 — Trocar o App

`src/App.jsx`:

```jsx
import CatalogoDesenhos from './pages/CatalogoDesenhos.jsx'
import './App.css'

function App() {
  return <CatalogoDesenhos />
}

export default App
```

Agora nenhum arquivo do template do Vite (logos, contador, links) permanece no projeto.

### Etapa 4 — Aplicar o layout

`src/App.css` deve conter o grid de duas colunas em telas maiores, os cards da listagem, o formulário e as cores de erro e sucesso. Referência mínima:

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

.desenho-card {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.erro-campo,
.feedback-erro {
  color: #b00020;
}

.feedback-sucesso {
  color: #0a6b2d;
}
```

O arquivo do repositório tem a versão completa, com estilos de lista, formulário e botão.

---

## 7. Comandos para executar

Terminal 1:

```powershell
cmd /c "npm run server"
```

Terminal 2:

```powershell
cmd /c "npm run dev"
```

Verificações automáticas:

```powershell
cmd /c "npm run lint"
cmd /c "npm run build"
cmd /c openspec.cmd validate catalogo-desenhos --strict
```

---

## 8. Resultado esperado

- Página com título, seção de desenhos e seção de cadastro.
- Listagem preenchida ao abrir, com os dois registros do `db.json`.
- Cadastro válido exibe sucesso, limpa o formulário e adiciona o item à lista.
- Formulário inválido exibe mensagens e não envia requisição.
- Mock desligado exibe erro com "Tentar novamente".
- Religar o mock e clicar em "Tentar novamente" restaura a listagem.

---

## 9. Casos de validação (checklist da spec)

| # | Cenário | Como testar | Esperado |
|---|---|---|---|
| 1 | Catálogo preenchido | abrir a página com mock ativo | dois cards completos |
| 2 | Carregamento | recarregar e observar | "Carregando desenhos..." antes da lista |
| 3 | Lista vazia | esvaziar `db.json` e recarregar | "Nenhum desenho encontrado." |
| 4 | Cadastro válido | preencher e enviar | sucesso, formulário limpo, item na lista |
| 5 | Cadastro em andamento | observar durante o envio | botão desabilitado com "Cadastrando..." |
| 6 | Campos vazios | enviar formulário vazio | quatro mensagens, sem requisição |
| 7 | Ano fora do intervalo | `1800` | mensagem do intervalo |
| 8 | Ano não numérico | `20a5` | mensagem do intervalo |
| 9 | Sinopse vazia | cadastrar sem sinopse | cadastro aceito |
| 10 | Sinopse longa | 501 caracteres | mensagem de limite |
| 11 | Falha na listagem | parar o mock e recarregar | mensagem de erro e botão |
| 12 | Nova tentativa com sucesso | religar o mock e clicar | lista no lugar do erro |
| 13 | Nova tentativa com falha | clicar com mock desligado | erro e botão permanecem |
| 14 | Falha no cadastro | enviar com mock desligado | erro e campos preservados |

Ao final, restaure o `db.json` original com os dois registros de exemplo.

---

## 10. Evidências para entrega

1. Prints dos 14 cenários ou de um vídeo curto percorrendo todos.
2. Print das abas Network/Console sem requisições duplicadas no cadastro.
3. Saída de `npm run lint`, `npm run build` e `openspec validate`.
4. Commit final contendo código e artefatos do OpenSpec.

---

## 11. Critérios de avaliação

| Critério | Peso |
|---|---|
| Integração correta entre página e componentes | 2,5 |
| Estados de carregamento, vazio, erro e sucesso | 2,5 |
| Cadastro atualiza a lista e limpa o formulário | 2,0 |
| Nova tentativa funcional nos dois desfechos | 1,5 |
| Layout responsivo e sem resíduos do template | 1,0 |
| Evidências dos 14 cenários | 0,5 |

---

## 12. Checklist

- [ ] Página renderiza os três componentes dos colegas
- [ ] Nenhuma referência ao template do Vite
- [ ] Erro de listagem com botão funcional
- [ ] Erro de cadastro preserva os campos
- [ ] `npm run lint` sem erros
- [ ] `npm run build` conclui
- [ ] `openspec validate catalogo-desenhos --strict` válido
- [ ] 14 cenários observados
- [ ] `db.json` restaurado
- [ ] Commit final feito

---

## 13. Referência

Gabarito: `src/pages/CatalogoDesenhos.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css` e `index.html`.
