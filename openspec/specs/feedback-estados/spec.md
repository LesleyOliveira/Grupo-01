# feedback-estados Specification

## Purpose

Define como um componente único apresenta os estados de carregamento, erro, vazio e sucesso, com papel acessível correto e ação de nova tentativa restrita ao erro.

## Requirements

### Requirement: Exibição da mensagem recebida

O componente SHALL exibir a mensagem recebida na prop `mensagem` sem alterar seu conteúdo e SHALL NOT gerar texto próprio a partir do tipo.

#### Scenario: Mensagem exibida sem alteração

- **WHEN** o componente recebe `tipo="carregando"` e `mensagem="Carregando desenhos..."`
- **THEN** o texto "Carregando desenhos..." é exibido ao usuário

#### Scenario: Nenhum texto próprio por tipo

- **WHEN** o componente recebe qualquer um dos quatro tipos com a mensagem acordada
- **THEN** exibe exatamente o texto recebido, sem acrescentar outro texto descritivo além do rótulo do botão quando aplicável

### Requirement: Variação visual por tipo

O componente SHALL aplicar no elemento raiz as classes `feedback` e `feedback-<tipo>`, permitindo distinguir visualmente carregamento, erro, vazio e sucesso.

#### Scenario: Classe do estado de carregamento

- **WHEN** o componente recebe `tipo="carregando"`
- **THEN** o elemento raiz contém as classes `feedback` e `feedback-carregando`

#### Scenario: Classe do estado de erro

- **WHEN** o componente recebe `tipo="erro"`
- **THEN** o elemento raiz contém as classes `feedback` e `feedback-erro`

#### Scenario: Classe do estado vazio

- **WHEN** o componente recebe `tipo="vazio"`
- **THEN** o elemento raiz contém as classes `feedback` e `feedback-vazio`

#### Scenario: Classe do estado de sucesso

- **WHEN** o componente recebe `tipo="sucesso"`
- **THEN** o elemento raiz contém as classes `feedback` e `feedback-sucesso`

### Requirement: Papel acessível por estado

O componente SHALL usar `role="alert"` quando `tipo` for `erro` e `role="status"` nos demais tipos.

#### Scenario: Erro anunciado imediatamente

- **WHEN** o componente recebe `tipo="erro"`
- **THEN** o elemento raiz tem `role="alert"`

#### Scenario: Carregamento anunciado de forma educada

- **WHEN** o componente recebe `tipo="carregando"`
- **THEN** o elemento raiz tem `role="status"`

#### Scenario: Lista vazia anunciada de forma educada

- **WHEN** o componente recebe `tipo="vazio"`
- **THEN** o elemento raiz tem `role="status"`

#### Scenario: Sucesso anunciado de forma educada

- **WHEN** o componente recebe `tipo="sucesso"`
- **THEN** o elemento raiz tem `role="status"`

### Requirement: Ação de nova tentativa restrita ao erro

O componente SHALL exibir o botão "Tentar novamente" apenas quando `tipo` for `erro` e `onRetry` for informado. O botão SHALL ter `type="button"` e SHALL chamar `onRetry` uma vez por clique.

#### Scenario: Erro com ação disponível

- **WHEN** o componente recebe `tipo="erro"` e uma função em `onRetry`
- **THEN** exibe o botão com o rótulo "Tentar novamente"
- **THEN** o botão tem `type="button"`

#### Scenario: Erro sem ação disponível

- **WHEN** o componente recebe `tipo="erro"` sem `onRetry`
- **THEN** exibe a mensagem com `role="alert"`
- **THEN** não exibe botão

#### Scenario: Outros tipos nunca exibem botão

- **WHEN** o componente recebe `tipo="carregando"`, `tipo="vazio"` ou `tipo="sucesso"`, mesmo com `onRetry` informado
- **THEN** não exibe botão

#### Scenario: Clique executa a ação uma única vez

- **WHEN** o usuário clica no botão "Tentar novamente"
- **THEN** a função recebida em `onRetry` é chamada uma vez

#### Scenario: Botão não envia formulário

- **WHEN** o componente é renderizado dentro de um formulário e o botão é clicado
- **THEN** o formulário não é enviado

### Requirement: Componente de apresentação sem estado nem dados

O componente SHALL obter todo o conteúdo das props e SHALL NOT manter estado interno, executar efeitos ou realizar requisições HTTP.

#### Scenario: Renderização sem efeitos colaterais

- **WHEN** o componente é renderizado com um conjunto de props
- **THEN** nenhuma requisição HTTP é disparada e a saída permanece a mesma enquanto as props não mudarem
