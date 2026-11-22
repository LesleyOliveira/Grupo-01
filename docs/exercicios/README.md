# Exercícios do ciclo `catalogo-desenhos`

Cada integrante tem um exercício próprio, escrito como uma atividade de faculdade: contexto, objetivos, enunciado, etapas, código orientador, comandos, casos de validação, evidências e critérios de avaliação.

## Ordem de execução

```text
01 Alexandre  -->  02 Mauro  -->  03 Joao  --+
                                04 Tiago  --+--> 06 Lesley --> commit final
                                05 Claudiana+
```

## Arquivos

| Ordem | Exercício | Responsável | Entrega principal |
|---|---|---|---|
| 01 | [Configuração do projeto e mock HTTP](01-alexandre-configuracao-json-server.md) | Alexandre | `db.json`, `.env` e `json-server` na porta 3001 |
| 02 | [Camada de acesso à API com Axios](02-mauro-integracao-api-axios.md) | Mauro | `src/api` isolando o endereço da API |
| 03 | [Componente de listagem](03-joao-listagem-desenhos.md) | João | `DesenhoList` renderizando por props |
| 04 | [Formulário e validação](04-tiago-formulario-validacao.md) | Tiago | regras de validação e formulário controlado |
| 05 | [Feedback de estados](05-claudiana-feedback-erros.md) | Claudiana | carregamento, vazio, erro e sucesso |
| 06 | [Página, integração e validação final](06-lesley-integracao-final.md) | Lesley | funcionalidade completa e commit |

## Regras válidas para todos

1. Nenhuma biblioteca pode ser adicionada sem aprovação do grupo. Aprovadas: `axios` e `json-server`.
2. Cada integrante altera apenas os arquivos sob sua responsabilidade.
3. Todo exercício termina com `npm run lint` e `npm run build` sem erros.
4. As evidências (prints e saídas de terminal) devem ser anexadas na entrega.
5. Ao encontrar um problema em arquivo de outro integrante, registre e combine a correção em vez de editar por conta própria.

## Como rodar o projeto

O projeto já está integrado com catálogo, formulário, validações e feedback de estado. Para rodar localmente:

```powershell
cmd /c "npm install"
cmd /c "npm run server"
cmd /c "npm run dev"
```

Use dois terminais: o `json-server` na porta `3001` e o Vite em paralelo. Se necessário, copie `.env.example` para `.env`.

```powershell
cmd /c "npm run server"
cmd /c "npm run dev"
```

A documentação consolidada do projeto está em [README do projeto](../../README.md).
