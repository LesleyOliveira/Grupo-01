# Proposal

## Why

O ciclo `catalogo-desenhos` já tem a camada de API pronta (exercícios 01 e 02), mas ainda não existe nenhum componente que comunique ao usuário o que está acontecendo na tela. Sem um componente único, cada estado (carregamento, erro, vazio e sucesso) tende a ser reimplementado com markup, textos e acessibilidade divergentes.

O exercício 05 da Claudiana pede exatamente esse componente reutilizável, com um comportamento especial: apenas o estado de erro oferece a ação "Tentar novamente".

## What Changes

- Cria o componente de apresentação `src/components/Feedback.jsx`, que recebe `tipo`, `mensagem` e `onRetry` e não busca dados nem mantém estado.
- Define quatro variações visuais e semânticas: `carregando`, `erro`, `vazio` e `sucesso`.
- Mapeia o papel acessível: `role="alert"` para erro e `role="status"` para os demais estados.
- Exibe o botão "Tentar novamente" **somente** quando `tipo === 'erro'` e `onRetry` foi informado; o botão usa `type="button"` e chama `onRetry` ao ser clicado.
- Aplica a classe `feedback feedback-<tipo>` na raiz para permitir estilização por estado em um ciclo posterior.
- Deixa o componente restrito à apresentação: sem `useState`, sem `useEffect`, sem Axios e sem acesso à API.
- **Fora de escopo**: integrar o componente em `src/pages/CatalogoDesenhos.jsx`, criar ou alterar CSS, centralizar os textos acordados na página, criar testes automatizados, alterar `DesenhoList`, `DesenhoForm` ou a camada de API e commitar o rascunho de visualização em `App.jsx`.

## Capabilities

### New Capabilities

- `feedback-estados`: apresentação acessível e consistente dos estados de carregamento, erro com nova tentativa, lista vazia e sucesso, a partir das props recebidas, sem estado interno nem acesso a dados.

### Modified Capabilities

Nenhuma. O projeto ainda não possui specs na área principal (`openspec/specs/`); o change `catalogo-desenhos` continua sendo o plano-mestre do ciclo e não é alterado por este change.

## Impact

- **Código novo**: `src/components/Feedback.jsx` (a pasta `src/components` ainda não existe e passa a ser criada).
- **Código existente**: nenhuma alteração permanente. Para a verificação visual, `src/App.jsx` pode receber um rascunho temporário com os quatro estados, que deve ser revertido antes do commit.
- **APIs**: nenhuma chamada HTTP; o componente não importa `src/api` nem Axios.
- **Dependências**: nenhuma nova biblioteca. A regra do grupo continua valendo: aprovadas apenas `axios` e `json-server`.
- **CSS**: nenhuma folha de estilo é alterada neste change; as classes `feedback-*` ficam reservadas para o exercício 06.
- **Verificação**: `npm run lint` e `npm run build` sem erros, além da conferência manual dos seis casos de validação do exercício 05.
- **Relação com o ciclo**: formaliza o planejamento do exercício 05 já previsto na tarefa 5 de `openspec/changes/catalogo-desenhos/tasks.md`. A implementação deste change não substitui nem reordena o plano-mestre do grupo.
