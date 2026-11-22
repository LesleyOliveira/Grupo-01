# Design

## Context

Ver `proposal.md` para a motivação e `specs/catalogo-desenhos/spec.md` para o comportamento exigido.

- Exercício 04 do ciclo `catalogo-desenhos`, responsável Tiago.
- Branch `formulario-validacao`; o repositório ainda não tem commits nessa branch.
- React 19 + Vite 8, oxlint, `axios` e `json-server` já instalados.
- `src/api` concluído no exercício 02; `src/components` ainda não existe.
- `src/App.jsx` contém um stub temporário para o build; a página definitiva é do exercício 06.
- O change guarda-chuva `catalogo-desenhos` já descreve a funcionalidade completa e contém uma tarefa equivalente à deste exercício.
- Não há framework de testes; a verificação é feita com `node -e`, lint, build e harness visual temporário.

## Goals / Non-Goals

**Goals:**

- Entregar a validação como função pura, executável no Node.
- Entregar o formulário controlado com mensagens por campo e bloqueio de envio inválido.
- Fixar o contrato de `onCadastrar` e `enviando` para a integração do exercício 06.
- Normalizar o payload antes de entregá-lo à página.

**Non-Goals:**

- Escolher uma biblioteca de formulário ou mover a validação para dentro do componente.
- Alterar a camada de API, o `package.json` ou o `db.json`.
- Definir a página, o layout ou a integração final; isso pertence ao exercício 06.

## Decisions

### 1. Função pura em `validarDesenho.js`

O módulo exporta `validarDesenho(valores)` e mantém as constantes `ANO_MINIMO = 1900` e `LIMITE_SINOPSE = 500`. A função devolve `{ campo: mensagem }` e não importa React nem a camada de API.

- **Por quê**: as regras podem ser verificadas com `node -e`, ficam fora do JSX e podem ser reutilizadas pela página.
- **Alternativa descartada**: validar dentro do componente; dificultaria a verificação isolada e misturaria regra com interface.
- **Única leitura externa**: `new Date().getFullYear()` define o limite superior e é recalculado a cada chamada.

### 2. Ano como texto no estado

O campo `anoLancamento` é armazenado como string e convertido apenas na validação e no payload. O input usa `type` de texto com `inputMode="numeric"`.

- **Por quê**: com `type="number"`, o navegador descartaria `20a5` e o campo chegaria vazio; a regra "ano não numérico" deixaria de ser observável.
- **Conversão**: `String(valores.anoLancamento ?? '').trim()` e `Number(...)`; `Number.isInteger` rejeita `20a5` (`NaN`) e `2.5` (não inteiro).
- **Trade-off**: o navegador não restringe a digitação; a validação é a barreira.

### 3. `noValidate` no formulário

O formulário usa `noValidate` para desligar a validação nativa do navegador.

- **Por quê**: as mensagens nativas variam por navegador e idioma; as mensagens do grupo precisam aparecer de forma consistente e em português.
- **Consequência**: toda a validação visível passa por `validarDesenho` e pelos `span.erro-campo`.

### 4. Estado controlado e limpeza de erro por campo

`valores` e `erros` ficam em `useState`. A função `alterar(campo, valor)` atualiza o valor e define o erro daquele campo como `undefined`.

- **Por quê**: o usuário vê a mensagem antiga desaparecer assim que corrige o campo, sem perder as mensagens dos outros campos.
- **Validação no envio**: as mensagens só aparecem depois do primeiro submit, evitando erros prematuros enquanto o usuário ainda está preenchendo.

### 5. Payload normalizado e limpeza somente em sucesso

No envio válido, o formulário chama `onCadastrar` com `titulo`, `genero`, `criador` e `sinopse` aparados e `anoLancamento` convertido para número. O formulário limpa os campos apenas quando a promessa resolve com `true`.

- **Por quê**: a página é dona da requisição e do estado de sucesso/falha; o formulário permanece reutilizável e não conhece Axios.
- **Contrato**: `onCadastrar(payload): Promise<boolean>`; a página do exercício 06 captura erros da API e devolve `false`.
- **Risco**: se um consumidor deixar a promessa rejeitar, o handler do formulário também rejeita. O contrato documenta a responsabilidade; um `try/catch` defensivo pode ser combinado depois, se o grupo decidir.

### 6. `enviando` desabilita o botão

A página controla `enviando`; enquanto for `true`, o botão fica `disabled` e o texto muda para `Cadastrando...`.

- **Por quê**: evita um segundo envio e dá retorno visual durante a requisição.
- **Trade-off**: o formulário depende da página para atualizar a prop; o contrato faz parte da integração do exercício 06.

### 7. Sem imports de API

Os dois arquivos não importam `src/api`, `axios` ou `fetch`.

- **Por quê**: respeita a fronteira do exercício e permite que o exercício 06 conecte `onCadastrar` a `criarDesenho` sem alterar o formulário.

### 8. Verificação visual com harness temporário

Como a página ainda não existe, a evidência visual usa um harness temporário em `App.jsx` que renderiza `<DesenhoForm>` com um `onCadastrar` stub.

- **Testes**: envio vazio, ano `1800`, ano `20a5`, sinopse com 501 caracteres, envio válido com `true`, envio com `false` e `enviando` verdadeiro.
- **Cuidado**: reverter `App.jsx` imediatamente após os prints; o harness não deve ser commitado. A versão definitiva de `App.jsx` é do exercício 06.
- **Alternativa descartada**: adiar toda a evidência visual para o exercício 06; o enunciado pede prints do formulário com mensagens de erro.

### 9. Mensagem do ano vazio

- Ano vazio: `Ano de lançamento é obrigatório.`
- Ano não numérico, decimal ou fora do intervalo: `Informe um ano entre 1900 e <ano atual>.`

- **Por quê**: o código-gabarito separa os dois casos e a spec guarda-chuva distingue "campo obrigatório vazio" de "ano inválido". A tabela do enunciado mostra apenas a mensagem do intervalo; a distinção fica registrada como premissa.

## Mensagens

| Campo | Condição | Mensagem |
|---|---|---|
| `titulo` | vazio ou só espaços | `Título é obrigatório.` |
| `genero` | vazio ou só espaços | `Gênero é obrigatório.` |
| `criador` | vazio ou só espaços | `Criador é obrigatório.` |
| `anoLancamento` | vazio ou só espaços | `Ano de lançamento é obrigatório.` |
| `anoLancamento` | não inteiro, menor que 1900 ou maior que o ano atual | `Informe um ano entre 1900 e <ano atual>.` |
| `sinopse` | mais de 500 caracteres após `trim` | `A sinopse deve ter no máximo 500 caracteres.` |

## Contrato de props

| Prop | Tipo | Comportamento |
|---|---|---|
| `onCadastrar(payload)` | `Function` assíncrona | recebe o payload normalizado; resolve `true` em sucesso e `false` em falha |
| `enviando` | `boolean` | desabilita o botão e exibe `Cadastrando...` enquanto a requisição corre |

## Risks / Trade-offs

- [Sobreposição com `catalogo-desenhos`] → Reconciliar os requisitos equivalentes antes de arquivar os dois changes; não arquivar com textos divergentes.
- [`onCadastrar` pode rejeitar] → O contrato exige resolução com `boolean`; a página do exercício 06 deve capturar o erro e devolver `false`. Se necessário, adicionar `try/catch` no formulário em uma revisão futura.
- [`enviando` é controlado pela página] → Se a página não atualizar a prop, um segundo envio pode ocorrer; o contrato cobre essa responsabilidade.
- [Mensagem do ano vazio diverge da tabela do enunciado] → Premissa registrada; alinhar com o grupo se preferirem uma única mensagem para todos os casos de ano.
- [Ano atual dinâmico] → A mensagem e os testes usam `new Date().getFullYear()`; não fixar 2026 no código.
- [`trim` na sinopse] → Texto com 501 caracteres e espaços nas extremidades pode ser aceito após a normalização; isso é coerente com o payload enviado.
- [Sem testes automatizados] → Verificação manual roteirizada, `node -e`, `npm run lint` e `npm run build`.
- [Harness temporário em `App.jsx`] → Reverter e não commitar; o arquivo definitivo pertence ao exercício 06.

## Migration Plan

1. Criar `src/components/validarDesenho.js`.
2. Verificar a função com `node -e` nos casos de borda.
3. Criar `src/components/DesenhoForm.jsx`.
4. Verificar os contratos estáticos e rodar lint/build.
5. Usar o harness temporário para a evidência visual e revertê-lo.
6. O exercício 06 integra o formulário à página `CatalogoDesenhos` e a `criarDesenho`.
7. Rollback: remover os dois arquivos; nenhum outro arquivo é alterado permanentemente.
