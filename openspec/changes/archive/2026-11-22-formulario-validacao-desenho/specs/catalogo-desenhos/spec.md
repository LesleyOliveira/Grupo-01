# Spec Delta

## Purpose

Define o comportamento observável da validação no cliente e do formulário de cadastro de desenhos: impedir o envio de dados inválidos, exibir mensagens por campo e entregar à página um payload normalizado, sem que o formulário conheça a API.

## ADDED Requirements

### Requirement: Validação independente da interface

A validação SHALL ser executável sem renderizar a interface e sem realizar chamadas HTTP, produzindo o mesmo resultado das regras usadas pelo formulário.

#### Scenario: Entrada válida

- **WHEN** a validação recebe título, gênero, criador e ano válidos e sinopse vazia
- **THEN** devolve um objeto vazio `{}`

#### Scenario: Entrada inválida

- **WHEN** a validação recebe um ou mais campos inválidos
- **THEN** devolve somente as chaves dos campos afetados
- **THEN** cada chave contém a mensagem correspondente à regra violada

#### Scenario: Execução fora da interface

- **WHEN** a validação é executada sem a interface
- **THEN** as regras produzem o resultado esperado
- **THEN** nenhuma requisição HTTP é realizada

### Requirement: Campos obrigatórios do cadastro

O sistema SHALL considerar obrigatórios os campos `titulo`, `genero`, `criador` e `anoLancamento`, rejeitando valores vazios ou compostos apenas por espaços.

#### Scenario: Campo de texto vazio

- **WHEN** `titulo`, `genero` ou `criador` está vazio ou contém apenas espaços
- **THEN** a validação devolve a mensagem `Título é obrigatório.`, `Gênero é obrigatório.` ou `Criador é obrigatório.`, respectivamente

#### Scenario: Ano vazio

- **WHEN** `anoLancamento` está vazio ou contém apenas espaços
- **THEN** a validação devolve a mensagem `Ano de lançamento é obrigatório.`

#### Scenario: Obrigatórios preenchidos

- **WHEN** os quatro campos obrigatórios estão preenchidos com valores válidos
- **THEN** a validação não devolve erro de obrigatoriedade para eles

### Requirement: Validação do ano de lançamento

O sistema SHALL aceitar apenas `anoLancamento` inteiro entre 1900 e o ano corrente, rejeitando valores não numéricos, decimais e fora do intervalo.

#### Scenario: Ano abaixo do mínimo

- **WHEN** o usuário informa `1800`
- **THEN** a validação devolve `Informe um ano entre 1900 e <ano atual>.`

#### Scenario: Ano acima do corrente

- **WHEN** o usuário informa um ano maior que o ano corrente
- **THEN** a validação devolve `Informe um ano entre 1900 e <ano atual>.`

#### Scenario: Ano não numérico

- **WHEN** o usuário informa `20a5`
- **THEN** a validação devolve `Informe um ano entre 1900 e <ano atual>.`

#### Scenario: Ano decimal

- **WHEN** o usuário informa `2.5`
- **THEN** a validação devolve `Informe um ano entre 1900 e <ano atual>.`

#### Scenario: Limites aceitos

- **WHEN** o usuário informa `1900` ou o ano corrente
- **THEN** a validação não devolve erro para `anoLancamento`

### Requirement: Limite da sinopse

O sistema SHALL aceitar `sinopse` vazia e SHALL rejeitar texto cujo comprimento, após remover espaços nas extremidades, ultrapasse 500 caracteres.

#### Scenario: Sinopse vazia

- **WHEN** `sinopse` está vazia ou contém apenas espaços
- **THEN** a validação não devolve erro para `sinopse`

#### Scenario: Sinopse no limite

- **WHEN** `sinopse` tem exatamente 500 caracteres após `trim`
- **THEN** a validação não devolve erro para `sinopse`

#### Scenario: Sinopse acima do limite

- **WHEN** `sinopse` tem 501 caracteres ou mais após `trim`
- **THEN** a validação devolve `A sinopse deve ter no máximo 500 caracteres.`

### Requirement: Atualização dos campos e limpeza de erro

Ao digitar em um campo, o sistema SHALL atualizar o valor exibido e SHALL limpar a mensagem de erro daquele campo.

#### Scenario: Alteração de campo

- **WHEN** o usuário digita em um campo
- **THEN** o valor exibido no campo é atualizado
- **THEN** a mensagem de erro daquele campo deixa de ser exibida

#### Scenario: Erro em outro campo

- **WHEN** o usuário corrige um campo com erro
- **THEN** as mensagens dos demais campos permanecem até que cada um seja corrigido ou o formulário seja reenviado

### Requirement: Bloqueio de envio inválido

O sistema SHALL validar o formulário no envio e SHALL impedir a chamada a `onCadastrar` quando houver qualquer erro.

#### Scenario: Envio com campos vazios

- **WHEN** o usuário envia o formulário sem preencher os campos obrigatórios
- **THEN** o sistema exibe as mensagens de título, gênero, ano e criador
- **THEN** `onCadastrar` não é chamado

#### Scenario: Envio com um campo inválido

- **WHEN** o usuário envia o formulário com apenas um campo inválido
- **THEN** o sistema exibe a mensagem desse campo
- **THEN** `onCadastrar` não é chamado

#### Scenario: Envio válido

- **WHEN** o usuário envia o formulário com todos os campos válidos
- **THEN** `onCadastrar` é chamado uma vez com o payload normalizado

### Requirement: Contrato de cadastro e limpeza

O sistema SHALL chamar `onCadastrar(payload)` com os textos sem espaços nas extremidades e `anoLancamento` convertido para número. O formulário SHALL limpar os campos somente quando `onCadastrar` resolver com `true`.

#### Scenario: Cadastro aceito

- **WHEN** `onCadastrar` resolve com `true`
- **THEN** o formulário limpa todos os campos
- **THEN** o formulário limpa todas as mensagens de erro

#### Scenario: Cadastro recusado

- **WHEN** `onCadastrar` resolve com `false`
- **THEN** o formulário mantém os valores digitados
- **THEN** o formulário não exibe sucesso

#### Scenario: Payload normalizado

- **WHEN** `onCadastrar` é chamado
- **THEN** `titulo`, `genero`, `criador` e `sinopse` são enviados sem espaços nas extremidades
- **THEN** `anoLancamento` é enviado como número inteiro
- **THEN** o payload não contém `id`

### Requirement: Estado de envio

O sistema SHALL desabilitar o botão de envio e SHALL exibir o texto `Cadastrando...` enquanto `enviando` for verdadeiro.

#### Scenario: Envio em andamento

- **WHEN** `enviando` é `true`
- **THEN** o botão de envio fica desabilitado
- **THEN** o texto do botão é `Cadastrando...`

#### Scenario: Envio ocioso

- **WHEN** `enviando` é `false`
- **THEN** o botão de envio fica habilitado
- **THEN** o texto do botão é `Cadastrar desenho`

### Requirement: Independência da API

O formulário SHALL NOT executar requisições HTTP. O cadastro SHALL ser delegado à página por meio da função recebida nas props.

#### Scenario: Nenhuma requisição pelo formulário

- **WHEN** o formulário é usado
- **THEN** ele não realiza requisições HTTP
- **THEN** o cadastro é delegado à função recebida

#### Scenario: Contrato de integração

- **WHEN** o formulário precisa cadastrar
- **THEN** ele chama a função recebida com o payload normalizado
- **THEN** ele não conhece URL, timeout ou formato de resposta da API
