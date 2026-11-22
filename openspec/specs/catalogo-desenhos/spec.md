# catalogo-desenhos Specification

## Purpose

Define o comportamento observável do catálogo de desenhos animados: listar os desenhos disponíveis na API, permitir o cadastro de um novo desenho com validação no cliente e reagir de forma previsível quando a API não estiver acessível.

## Requirements

### Requirement: Listagem de desenhos animados

Ao carregar a página do catálogo, o sistema SHALL buscar os desenhos na API HTTP e exibir cada desenho com título, gênero, ano de lançamento, criador e sinopse.

#### Scenario: Catálogo com desenhos cadastrados

- **WHEN** a página do catálogo é aberta e a API responde com uma lista de desenhos
- **THEN** o sistema exibe um item para cada desenho retornado
- **THEN** cada item mostra título, gênero, ano de lançamento e criador
- **THEN** a sinopse é exibida quando estiver preenchida

#### Scenario: Carregamento em andamento

- **WHEN** a requisição de listagem foi iniciada e ainda não foi concluída
- **THEN** o sistema exibe um indicador de carregamento
- **THEN** o sistema não exibe mensagem de erro nem de lista vazia enquanto aguarda a resposta

### Requirement: Catálogo sem desenhos cadastrados

Quando a API responder com uma lista vazia, o sistema SHALL informar que nenhum desenho foi cadastrado, em vez de exibir apenas uma área em branco.

#### Scenario: Lista vazia

- **WHEN** a página do catálogo é aberta e a API responde com uma lista vazia
- **THEN** o sistema exibe a mensagem de que nenhum desenho foi encontrado
- **THEN** o sistema não exibe mensagem de erro

### Requirement: Cadastro de desenho animado

O sistema SHALL permitir cadastrar um desenho animado a partir de um formulário com os campos título, gênero, ano de lançamento, criador e sinopse, enviando os dados para a API HTTP.

#### Scenario: Cadastro com dados válidos

- **WHEN** o usuário preenche todos os campos obrigatórios com valores válidos e envia o formulário
- **THEN** o sistema envia a requisição de cadastro para a API
- **THEN** o sistema limpa o formulário
- **THEN** o sistema exibe a mensagem "Desenho cadastrado com sucesso"
- **THEN** o novo desenho passa a aparecer na listagem

#### Scenario: Cadastro em andamento

- **WHEN** a requisição de cadastro foi iniciada e ainda não foi concluída
- **THEN** o botão de envio fica desabilitado
- **THEN** o sistema não envia uma segunda requisição enquanto a primeira estiver em andamento

### Requirement: Campos obrigatórios do cadastro

O sistema SHALL impedir o envio do formulário quando título, gênero, ano de lançamento ou criador estiverem vazios ou contiverem apenas espaços, indicando quais campos precisam ser corrigidos.

#### Scenario: Campo obrigatório vazio

- **WHEN** o usuário tenta enviar o formulário com um campo obrigatório vazio ou preenchido apenas com espaços
- **THEN** o sistema não envia a requisição de cadastro
- **THEN** o sistema exibe uma mensagem de validação para o campo afetado

#### Scenario: Formulário válido

- **WHEN** todos os campos obrigatórios estão preenchidos com valores válidos
- **THEN** o sistema não exibe mensagens de validação e permite o envio

### Requirement: Validação do ano de lançamento

O sistema SHALL aceitar apenas anos de lançamento inteiros entre 1900 e o ano corrente, rejeitando o envio quando o valor estiver fora desse intervalo ou não for numérico.

#### Scenario: Ano fora do intervalo

- **WHEN** o usuário informa um ano menor que 1900 ou maior que o ano corrente
- **THEN** o sistema não envia a requisição de cadastro
- **THEN** o sistema exibe uma mensagem informando o intervalo aceito

#### Scenario: Ano não numérico

- **WHEN** o usuário informa um valor não numérico no campo de ano
- **THEN** o sistema não envia a requisição de cadastro
- **THEN** o sistema exibe uma mensagem de validação para o campo de ano

### Requirement: Limite da sinopse

O sistema SHALL aceitar sinopse vazia e SHALL rejeitar texto com mais de 500 caracteres.

#### Scenario: Sinopse vazia

- **WHEN** o usuário envia o formulário com os campos obrigatórios válidos e a sinopse vazia
- **THEN** o sistema envia a requisição de cadastro normalmente

#### Scenario: Sinopse acima do limite

- **WHEN** o usuário informa mais de 500 caracteres na sinopse
- **THEN** o sistema não envia a requisição de cadastro
- **THEN** o sistema exibe uma mensagem informando o limite de 500 caracteres

### Requirement: Falha ao carregar o catálogo

Quando a busca da listagem falhar, o sistema SHALL informar que não foi possível carregar os desenhos e SHALL oferecer uma ação para tentar novamente.

#### Scenario: API indisponível na listagem

- **WHEN** a página do catálogo é aberta e a requisição de listagem falha
- **THEN** o sistema exibe a mensagem "Não foi possível carregar os desenhos."
- **THEN** o sistema exibe a ação "Tentar novamente"

#### Scenario: Nova tentativa bem-sucedida

- **WHEN** o usuário aciona "Tentar novamente" e a API responde com sucesso
- **THEN** o sistema exibe novamente o indicador de carregamento
- **THEN** o sistema substitui a mensagem de erro pela listagem de desenhos
- **THEN** a mensagem de erro deixa de ser exibida

#### Scenario: Nova tentativa malsucedida

- **WHEN** o usuário aciona "Tentar novamente" e a API continua indisponível
- **THEN** o sistema mantém a mensagem de erro e a ação "Tentar novamente" disponíveis

### Requirement: Falha ao cadastrar desenho

Quando a requisição de cadastro falhar, o sistema SHALL manter os dados preenchidos no formulário e informar que o cadastro não foi concluído.

#### Scenario: API indisponível no cadastro

- **WHEN** o usuário envia um formulário válido e a requisição de cadastro falha
- **THEN** o sistema exibe a mensagem "Não foi possível cadastrar o desenho."
- **THEN** o sistema mantém os valores digitados no formulário
- **THEN** o novo desenho não é adicionado à listagem

#### Scenario: Nova tentativa de envio após um cadastro anterior

- **WHEN** uma mensagem de sucesso ou de falha de cadastro está visível e o usuário envia o formulário novamente
- **THEN** o sistema remove a mensagem anterior antes de processar o novo envio
- **THEN** se o novo envio for barrado pela validação, apenas as mensagens de validação dos campos ficam visíveis
