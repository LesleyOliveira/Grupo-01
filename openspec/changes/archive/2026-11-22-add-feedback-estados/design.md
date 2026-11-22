# Design

## Context

Ver `proposal.md` para a motivação e `specs/feedback-estados/spec.md` para o comportamento exigido.

- React 19 + Vite 8, com lint via `oxlint` e sem framework de testes.
- `src/api/` está pronto (exercícios 01 e 02); `src/components/` ainda não existe.
- `src/App.jsx` é um placeholder temporário e `src/App.css` ainda contém estilos do template.
- O componente pertence à Claudiana; CSS e integração na página pertencem ao exercício 06 (Lesley).
- Regra do grupo: nenhuma biblioteca nova sem aprovação; aprovadas `axios` e `json-server`.

## Goals / Non-Goals

**Goals:**

- Fixar um contrato de props estável e previsível para os quatro estados.
- Garantir acessibilidade correta (`alert` para erro, `status` para os demais).
- Exibir ação de nova tentativa somente quando ela realmente existe.
- Manter o componente puro, verificável manualmente sem mock e sem estado.

**Non-Goals:**

- Buscar dados, controlar estado da tela ou conhecer Axios.
- Centralizar os textos acordados na página ou criar constantes de mensagem.
- Estilizar os estados ou integrar o componente em `CatalogoDesenhos`.
- Adicionar PropTypes, Zod, Vitest ou React Testing Library.

## Decisions

### 1. Componente funcional sem estado, efeitos ou acesso a dados

Contrato:

| Prop | Tipo | Obrigatória | Comportamento |
|---|---|---|---|
| `tipo` | `'carregando' \| 'erro' \| 'vazio' \| 'sucesso'` | sim | Define role, classe e disponibilidade do botão |
| `mensagem` | `string` | sim | Texto exibido sem alteração |
| `onRetry` | `function` | não | Quando presente e `tipo === 'erro'`, habilita o botão |

- **Por quê**: a página é dona do estado e da busca; o componente apenas apresenta o que recebe.
- **Alternativa descartada**: componente que busca dados ou controla o estado da tela — misturaria responsabilidades e dificultaria a reutilização.

### 2. Papel acessível derivado do tipo

| `tipo` | `role` | Classe | Botão |
|---|---|---|---|
| `carregando` | `status` | `feedback-carregando` | não |
| `erro` | `alert` | `feedback-erro` | só com `onRetry` |
| `vazio` | `status` | `feedback-vazio` | não |
| `sucesso` | `status` | `feedback-sucesso` | não |

- **Por quê**: erro precisa ser anunciado imediatamente; carregamento, vazio e sucesso não devem interromper o usuário.
- **Alternativa descartada**: usar `alert` em todos os estados — interromperia leitores de tela sem necessidade.

### 3. Botão condicional duplo e `type="button"`

A condição é `tipo === 'erro' && onRetry`, e o botão usa `type="button"` com `onClick={onRetry}`.

- **Por quê**: a condição dupla evita um botão sem ação quando a página esquece de passar `onRetry`; `type="button"` evita submit acidental dentro de formulários.
- **Alternativa descartada**: exibir o botão sempre que o tipo for erro — criaria um controle inútil.
- **Contrato**: `onRetry` deve ser uma função quando informado; não há validação de tipo em runtime para não ampliar o escopo do exercício.

### 4. Classes por estado na raiz

A raiz recebe `feedback feedback-${tipo}`.

- **Por quê**: o exercício 06 poderá estilizar `.feedback-erro`, `.feedback-sucesso` etc. sem alterar o componente.
- **Alternativa descartada**: estilos inline ou CSS-in-JS — exigiriam decisão de estilo agora e, no caso de CSS-in-JS, uma dependência não aprovada.

### 5. Textos vêm da prop, não do componente

O componente não mantém um mapa `tipo -> texto`; ele exibe exatamente `mensagem`.

- **Por quê**: a página centraliza os textos acordados no exercício 06 e o componente permanece reutilizável para outras telas.
- **Alternativa descartada**: embutir os quatro textos no componente — duplicaria decisões de conteúdo e impediria mensagens específicas por contexto.
- **Observação**: os textos acordados no exercício 05 são usados como dados de verificação no rascunho, não como padrões internos do componente.

### 6. Verificação manual com rascunho temporário

O componente será validado montando os quatro estados em `src/App.jsx`, rodando `npm run dev`, inspecionando DOM e console, e revertendo o rascunho.

- **Por quê**: não há framework de testes e o exercício pede evidências visuais.
- **Alternativa descartada**: adicionar Vitest/RTL — biblioteca não aprovada e fora do escopo do exercício.

## Risks / Trade-offs

- [Receber um `tipo` inválido em runtime] → contrato documentado e revisão dos usos na integração do exercício 06; sem PropTypes para não adicionar dependência.
- [`onRetry` truthy mas não função] → o contrato exige função; o uso na página será revisado no exercício 06.
- [Esquecer o rascunho em `App.jsx`] → tarefa explícita de reversão com `git diff -- src/App.jsx` vazio.
- [Estados sem estilo até o exercício 06] → as classes já são emitidas; a conferência visual completa fica no exercício 06.
- [Sobreposição com a spec do ciclo] → este change define o contrato do componente; a spec de `catalogo-desenhos` define o comportamento da página. Nenhum requisito existente é alterado.

## Migration Plan

1. Criar `src/components/Feedback.jsx` e validar os quatro estados com o rascunho temporário.
2. Reverter `src/App.jsx` ao estado anterior.
3. Rodar `npm run lint` e `npm run build`.
4. Rollback: remover `src/components/Feedback.jsx`; nenhum outro arquivo é alterado.
