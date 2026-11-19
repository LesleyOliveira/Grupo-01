# Exercício 01 — Configuração do projeto e mock HTTP

**Integrante:** Alexandre
**Ciclo:** `catalogo-desenhos`
**Tempo estimado:** 60 minutos
**Depende de:** projeto React + Vite já criado
**Bloqueia:** exercícios 02 a 06

---

## 1. Contexto

O grupo precisa de uma API HTTP para desenvolver o catálogo de desenhos animados, mas ainda não existe back-end. A solução temporária é usar o `json-server`, que transforma um arquivo JSON em uma API REST completa, com `GET`, `POST`, `PUT` e `DELETE`.

Seu exercício é preparar a base do projeto: versionamento, dependências, configuração de ambiente, banco de dados simulado e o comando que sobe o servidor.

---

## 2. Objetivos de aprendizagem

Ao final deste exercício, você deve ser capaz de:

- inicializar um repositório Git e proteger arquivos sensíveis com `.gitignore`;
- instalar dependências de produção e de desenvolvimento com npm;
- criar scripts npm;
- configurar variáveis de ambiente no Vite;
- subir um mock de API com `json-server` e testá-lo com requisições HTTP reais.

---

## 3. Pré-requisitos

- Node.js 20 ou superior instalado;
- terminal aberto na raiz do projeto;
- leitura do arquivo `openspec/changes/catalogo-desenhos/proposal.md`.

> **Regra do grupo:** nenhuma biblioteca pode ser adicionada sem consulta e aprovação. As já aprovadas para este exercício são `axios` (produção) e `json-server` (desenvolvimento).

---

## 4. Arquivos sob sua responsabilidade

```text
.gitignore
.env
.env.example
db.json
package.json
```

Você não deve editar arquivos dentro de `src/`. Esses pertencem aos outros integrantes.

---

## 5. Enunciado

Prepare o projeto para consumir uma API HTTP local na porta `3001`, com uma coleção chamada `desenhos`. A coleção deve começar com dois registros de exemplo, e a aplicação deve ler o endereço da API a partir de uma variável de ambiente.

---

## 6. Etapas

### Etapa 1 — Versionar o projeto

Inicialize o repositório e registre o estado atual:

```powershell
git init
git add .
git commit -m "chore: template React + Vite inicial"
```

Antes do commit, acrescente ao final de `.gitignore`:

```text
.env
```

**Por quê:** o arquivo `.env` guarda configuração local e não deve ser versionado. O `.env.example` é o arquivo que o grupo compartilha.

### Etapa 2 — Instalar as dependências aprovadas

```powershell
npm install axios
npm install -D json-server@0.17.4
```

A versão do `json-server` é fixada de propósito: a série `0.17.x` usa as flags `--watch` e `--port` apresentadas neste exercício. Versões diferentes podem mudar a linha de comando.

### Etapa 3 — Criar o banco de dados simulado

Crie `db.json` na raiz:

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

O segundo registro tem `sinopse` vazia de propósito: ele será usado no exercício 03 para testar a exibição condicional.

### Etapa 4 — Criar o script do servidor

Em `package.json`, adicione o script:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "oxlint",
  "preview": "vite preview",
  "server": "json-server --watch db.json --port 3001"
}
```

`--watch` recarrega o arquivo quando ele muda. `--port 3001` evita conflito com o Vite, que usa a porta 5173.

### Etapa 5 — Configurar o endereço da API

Crie dois arquivos com o mesmo conteúdo:

`.env` (não versionado) e `.env.example` (versionado):

```text
VITE_API_URL=http://localhost:3001
```

No Vite, apenas variáveis com prefixo `VITE_` ficam disponíveis no código do navegador. Mais adiante, o exercício 02 vai ler esse valor.

---

## 7. Comandos para executar

Terminal 1:

```powershell
npm run server
```

Se o PowerShell bloquear comandos npm por política de execução, use:

```powershell
cmd /c "npm run server"
```

Terminal 2, para testar a API:

```powershell
curl.exe http://localhost:3001/desenhos
```

Para testar o cadastro, salve o corpo em um arquivo e envie com `--data-binary`:

```powershell
curl.exe -X POST http://localhost:3001/desenhos -H "Content-Type: application/json" --data-binary "@desenho-teste.json"
```

Com `desenho-teste.json` contendo:

```json
{"titulo":"Teste de contrato","genero":"Teste","anoLancamento":2020,"criador":"Teste","sinopse":""}
```

> Evite `-d` com JSON entre aspas no PowerShell: as aspas são consumidas pelo terminal e o servidor recebe um JSON inválido.

---

## 8. Resultado esperado

- `GET /desenhos` retorna os dois registros;
- `POST /desenhos` retorna o objeto enviado acrescido de `id`;
- o arquivo `db.json` passa a conter o novo registro;
- `git status` não lista `.env`;
- `npm run server` inicia sem erros na porta 3001.

---

## 9. Casos de validação

| Caso | Ação | Resultado esperado |
|---|---|---|
| Listagem | `curl.exe http://localhost:3001/desenhos` | JSON com 2 registros |
| Cadastro | `POST` com corpo válido | status 201 e campo `id` |
| Persistência | abrir `db.json` após o `POST` | novo registro gravado |
| Arquivo sensível | `git status` | `.env` não aparece |
| Porta ocupada | subir o servidor duas vezes | segunda execução falha com aviso de porta em uso |

Ao terminar os testes, remova o registro "Teste de contrato" de `db.json` para deixar a base limpa para o próximo integrante.

---

## 10. Evidências para entrega

1. Print do terminal com `npm run server` ativo.
2. Print da resposta do `GET`.
3. Print da resposta do `POST` mostrando o `id`.
4. Print do `db.json` com o registro criado.
5. Print de `git status` sem `.env`.
6. Link do commit `chore: template React + Vite inicial`.

---

## 11. Critérios de avaliação

| Critério | Peso |
|---|---|
| Repositório inicializado e `.env` ignorado | 2,0 |
| Dependências corretas, com `json-server` fixado | 2,0 |
| `db.json` válido e com os dois registros | 2,0 |
| Script `server` funcionando na porta 3001 | 2,0 |
| `GET` e `POST` comprovados com prints | 2,0 |

---

## 12. Checklist

- [ ] `git log --oneline` mostra o commit inicial
- [ ] `.env` está no `.gitignore`
- [ ] `package.json` tem `axios`, `json-server` e o script `server`
- [ ] `db.json` é JSON válido
- [ ] `.env` e `.env.example` existem com `VITE_API_URL`
- [ ] `GET` e `POST` testados
- [ ] registro de teste removido do `db.json`

---

## 13. Referência

A implementação usada como gabarito está nos arquivos `db.json`, `package.json` e `.gitignore` do repositório. Compare sua solução com ela somente depois de concluir as etapas.
