# Tasks

## 1. Implementar o componente

- [x] 1.1 Criar `src/components/Feedback.jsx` com a assinatura `Feedback({ tipo, mensagem, onRetry })`, exibindo a mensagem recebida e aplicando `feedback feedback-${tipo}` na raiz (verificação: o arquivo existe e `npm run lint` termina sem erros).
- [x] 1.2 Aplicar `role="alert"` quando `tipo === 'erro'` e `role="status"` nos demais tipos (verificação: revisar o JSX e conferir os quatro casos no DOM durante a tarefa 2.2).
- [x] 1.3 Renderizar o botão "Tentar novamente" somente quando `tipo === 'erro' && onRetry`, com `type="button"` e `onClick={onRetry}` (verificação: revisar o JSX e confirmar que nenhum outro tipo produz botão).

## 2. Validar os casos do exercício

- [x] 2.1 Montar um rascunho temporário em `src/App.jsx` com os quatro estados e `onRetry={() => console.log('tentar novamente')}`; rodar `npm run dev` e confirmar os quatro blocos com os textos acordados e botão apenas no erro (verificação: print dos quatro estados renderizados).
- [x] 2.2 Inspecionar o DOM do erro e confirmar `role="alert"` e `feedback-erro`; confirmar `role="status"` em carregamento, vazio e sucesso (verificação: print do HTML inspecionado mostrando o role do erro).
- [x] 2.3 Clicar em "Tentar novamente" e confirmar no console uma única chamada de `onRetry` por clique (verificação: print do console).
- [x] 2.4 Renderizar `tipo="erro"` sem `onRetry` e confirmar que a mensagem e o `role="alert"` permanecem, sem botão (verificação: inspeção visual do rascunho).
- [x] 2.5 Reverter `src/App.jsx` ao estado anterior e confirmar que o rascunho não permaneceu (verificação: `git diff -- src/App.jsx` vazio).

## 3. Fechamento estático e evidências

- [x] 3.1 Rodar `npm run lint` e `npm run build` no estado final e confirmar que terminam sem erros (verificação: saídas dos dois comandos).
- [x] 3.2 Confirmar que o único arquivo novo é `src/components/Feedback.jsx` (verificação: `git status --short` lista apenas o componente e nenhum rascunho).
- [x] 3.3 Confirmar que o componente não importa `src/api`, Axios, `useState` ou `useEffect` (verificação: busca no arquivo não encontra essas referências).
- [x] 3.4 Anexar à entrega as evidências das tarefas 2.1 a 2.3 e as saídas de lint/build da tarefa 3.1 (verificação: quatro evidências registradas).

## Workflow follow-up

- O commit do componente e das evidências fica no fechamento do ciclo `catalogo-desenhos` (tarefa 7.4), não neste change.
- Arquivar este change somente depois que o componente estiver integrado e validado no exercício 06, se o grupo optar por mantê-lo separado.
