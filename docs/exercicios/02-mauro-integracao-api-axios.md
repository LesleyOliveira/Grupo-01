# Exercício 02 — Camada de acesso à API com Axios

**Integrante:** Mauro
**Ciclo:** `catalogo-desenhos`
**Tempo estimado:** 60 minutos
**Depende de:** exercício 01 concluído (mock rodando)
**Bloqueia:** exercícios 03 a 06

---

## 1. Contexto

Os componentes de interface não devem saber qual é o endereço da API, qual biblioteca HTTP é usada ou como os erros são capturados. Quando o grupo migrar do `json-server` para um back-end próprio, apenas a configuração deve mudar.

Seu exercício é criar a única porta de entrada dos dados: um cliente Axios configurado e duas funções de domínio.

---

## 2. Objetivos de aprendizagem

- criar uma instância do Axios com `baseURL` e `timeout`;
- ler variáveis de ambiente do Vite (`import.meta.env`);
- separar cliente HTTP de funções de domínio;
- documentar um contrato de API;
- verificar módulos JavaScript puros com Node, sem framework de testes.

---

## 3. Pré-requisitos

- exercício 01 concluído;
- `npm run server` ativo em outro terminal;
- leitura de `openspec/changes/catalogo-desenhos/design.md`, seção 1.

---

## 4. Arquivos sob sua responsabilidade

```text
src/api/apiClient.js
src/api/desenhosApi.js
```

Não altere componentes, páginas ou `package.json`.

---

## 5. Enunciado

Implemente uma camada de API com dois arquivos:

1. `apiClient.js` exporta uma instância do Axios apontando para `VITE_API_URL`, com timeout de 5 segundos e cabeçalho JSON.
2. `desenhosApi.js` exporta `listarDesenhos()` e `criarDesenho(desenho)`, devolvendo apenas os dados da resposta.

---

## 6. Etapas

### Etapa 1 — Criar o cliente

`src/api/apiClient.js`:

```js
import axios from 'axios'

const baseURL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})
```

Pontos de atenção:

- `import.meta.env?.VITE_API_URL` usa encadeamento opcional porque `import.meta.env` só existe dentro do Vite. Assim o módulo também pode ser importado no Node para verificação.
- O valor depois de `??` é apenas um fallback para desenvolvimento. A configuração oficial vem do `.env`.
- O `timeout` evita que a tela fique carregando indefinidamente quando o mock estiver desligado. Essa é a base do comportamento de erro do exercício 05.

### Etapa 2 — Criar as funções de domínio

`src/api/desenhosApi.js`:

```js
import { apiClient } from './apiClient.js'

export async function listarDesenhos() {
  const { data } = await apiClient.get('/desenhos')
  return data
}

export async function criarDesenho(desenho) {
  const { data } = await apiClient.post('/desenhos', desenho)
  return data
}
```

Cada função devolve somente `data`, escondendo do restante da aplicação detalhes como `status`, `headers` e `config`.

### Etapa 3 — Fixar o contrato

| Método | Rota | Corpo enviado | Resposta |
|---|---|---|---|
| `GET` | `/desenhos` | nenhum | lista de desenhos |
| `POST` | `/desenhos` | desenho sem `id` | desenho criado, com `id` |

O formulário nunca envia `id`; quem gera é a API. Esse contrato precisa continuar válido quando o `json-server` for substituído por um back-end próprio.

---

## 7. Comandos para executar

Com o mock ativo:

```powershell
node -e "import('./src/api/desenhosApi.js').then(async (api) => { const lista = await api.listarDesenhos(); console.log('total:', lista.length); const novo = await api.criarDesenho({ titulo: 'Teste de contrato', genero: 'Teste', anoLancamento: 2020, criador: 'Teste', sinopse: '' }); console.log('criado id:', novo.id) }).catch((e) => { console.error(e.message); process.exit(1) })"
```

Depois pare o servidor e rode apenas a listagem para observar o erro:

```powershell
node -e "import('./src/api/desenhosApi.js').then((api) => api.listarDesenhos()).then(console.log).catch((e) => console.error('falhou:', e.message))"
```

---

## 8. Resultado esperado

Com o mock ativo:

```text
total: 2
criado id: 3
```

Com o mock desligado:

```text
falhou: connect ECONNREFUSED 127.0.0.1:3001
```

A mensagem exata pode variar, mas a chamada deve ser rejeitada. É essa rejeição que os componentes vão transformar em mensagem para o usuário.

---

## 9. Casos de validação

| Caso | Ação | Resultado esperado |
|---|---|---|
| Listagem | chamar `listarDesenhos()` | array com os registros do `db.json` |
| Cadastro | chamar `criarDesenho()` | objeto com `id` numérico |
| Base URL | remover `.env` e reiniciar | fallback `localhost:3001` funciona |
| Timeout/queda | parar o servidor | promessa rejeitada em até ~5 s |
| Isolamento | `grep` por `localhost` em `src` | só aparece em `apiClient.js` |

---

## 10. Evidências para entrega

1. Print da execução do comando Node com `total` e `criado id`.
2. Print da falha com o servidor desligado.
3. Print dos dois arquivos criados.
4. Registro de que o registro "Teste de contrato" foi removido do `db.json`.

---

## 11. Critérios de avaliação

| Critério | Peso |
|---|---|
| Cliente Axios com `baseURL` vindo do ambiente | 2,5 |
| Timeout configurado | 1,5 |
| Funções `listarDesenhos` e `criarDesenho` corretas | 3,0 |
| Contrato documentado e respeitado | 1,5 |
| Verificação com Node executada | 1,5 |

---

## 12. Checklist

- [ ] `apiClient.js` e `desenhosApi.js` criados
- [ ] Nenhuma URL fixa fora de `apiClient.js`
- [ ] `listarDesenhos()` testada com o mock ativo
- [ ] `criarDesenho()` testada e `id` conferido
- [ ] Falha de conexão observada com o mock desligado
- [ ] `db.json` limpo após os testes

---

## 13. Referência

Gabarito: `src/api/apiClient.js` e `src/api/desenhosApi.js`. Compare apenas depois de concluir sua versão.
