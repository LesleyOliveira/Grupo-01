# Exercício 05 — Feedback de carregamento, vazio, erro e sucesso

**Integrante:** Claudiana
**Ciclo:** `catalogo-desenhos`
**Tempo estimado:** 45 minutos
**Depende de:** exercício 01 concluído
**É usado por:** exercício 06

---

## 1. Contexto

Uma tela que não informa o que está acontecendo parece quebrada. Carregamento, lista vazia, erro e sucesso são quatro estados diferentes, mas compartilham a mesma estrutura visual. Repetir esse markup em cada tela gera inconsistência e mensagens divergentes.

Seu exercício é criar um componente único de feedback, com um comportamento especial: apenas o estado de erro oferece a ação "Tentar novamente".

---

## 2. Objetivos de aprendizagem

- projetar um componente com variações por prop;
- renderizar botão apenas quando a ação existe;
- usar `role="alert"` e `role="status"` para acessibilidade;
- centralizar textos de estado para manter consistência.

---

## 3. Pré-requisitos

- exercício 01 concluído;
- leitura do requisito "Falha ao carregar o catálogo" em `specs/catalogo-desenhos/spec.md`.

---

## 4. Arquivos sob sua responsabilidade

```text
src/components/Feedback.jsx
```

Não busque dados nem controle estado da tela. O componente apenas recebe o que deve mostrar.

---

## 5. Enunciado

Crie o componente `Feedback` com as seguintes props:

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `tipo` | `'carregando' \| 'erro' \| 'vazio' \| 'sucesso'` | sim | define o estilo e o papel acessível |
| `mensagem` | `string` | sim | texto exibido ao usuário |
| `onRetry` | `function` | não | quando presente e `tipo === 'erro'`, exibe o botão "Tentar novamente" |

### Textos acordados

| Estado | Texto |
|---|---|
| carregando | `Carregando desenhos...` |
| erro de listagem | `Não foi possível carregar os desenhos.` |
| vazio | `Nenhum desenho encontrado.` |
| sucesso | `Desenho cadastrado com sucesso` |

---

## 6. Etapas

### Etapa 1 — Implementar o componente

`src/components/Feedback.jsx`:

```jsx
export default function Feedback({ tipo, mensagem, onRetry }) {
  const papel = tipo === 'erro' ? 'alert' : 'status'

  return (
    <div className={`feedback feedback-${tipo}`} role={papel}>
      <p>{mensagem}</p>
      {tipo === 'erro' && onRetry ? (
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
```

### Etapa 2 — Analisar as decisões

- **`tipo === 'erro' ? 'alert' : 'status'`**: leitores de tela anunciam `alert` imediatamente e `status` de forma educada. Erro precisa ser percebido na hora; carregamento e sucesso não interrompem o usuário.
- **`tipo === 'erro' && onRetry`**: a condição dupla evita um botão sem ação. Se a página esquecer de passar `onRetry`, o erro continua visível, mas não aparece um botão inútil.
- **`type="button"`**: impede que, dentro de um formulário, este botão dispare um `submit` sem querer.
- **Classe `feedback-${tipo}`**: permite estilizar cada estado no CSS (`feedback-erro`, `feedback-sucesso`).

---

## 7. Comandos para executar

```powershell
cmd /c "npm run lint"
cmd /c "npm run build"
```

Para observar visualmente antes da integração, crie um rascunho temporário em `src/App.jsx` (não commite):

```jsx
import Feedback from './components/Feedback.jsx'

export default function App() {
  return (
    <div>
      <Feedback tipo="carregando" mensagem="Carregando desenhos..." />
      <Feedback
        tipo="erro"
        mensagem="Não foi possível carregar os desenhos."
        onRetry={() => console.log('tentar novamente')}
      />
      <Feedback tipo="vazio" mensagem="Nenhum desenho encontrado." />
      <Feedback tipo="sucesso" mensagem="Desenho cadastrado com sucesso" />
    </div>
  )
}
```

Rode `npm run dev` e desfaça a alteração depois.

---

## 8. Resultado esperado

- Quatro blocos visuais distintos, cada um com seu texto.
- Apenas o bloco de erro exibe o botão "Tentar novamente".
- Clicar no botão executa a função recebida em `onRetry`.
- Nenhum bloco de carregamento, vazio ou sucesso possui botão.

---

## 9. Casos de validação

| Caso | Props | Resultado esperado |
|---|---|---|
| Carregamento | `tipo="carregando"` | texto + `role="status"`, sem botão |
| Erro com ação | `tipo="erro"` + `onRetry` | texto + `role="alert"` + botão |
| Erro sem ação | `tipo="erro"` | texto + `role="alert"`, sem botão |
| Vazio | `tipo="vazio"` | texto + `role="status"` |
| Sucesso | `tipo="sucesso"` | texto + `role="status"` |
| Clique no botão | botão do erro | função chamada uma vez |

---

## 10. Evidências para entrega

1. Print dos quatro estados renderizados.
2. Print do HTML inspecionado mostrando `role="alert"` no erro.
3. Print do console comprovando a chamada de `onRetry`.
4. Saída de `npm run lint` e `npm run build`.

---

## 11. Critérios de avaliação

| Critério | Peso |
|---|---|
| Quatro estados funcionando | 3,0 |
| Botão apenas no erro e apenas com `onRetry` | 2,5 |
| Papéis acessíveis corretos | 2,0 |
| Classes por estado | 1,5 |
| Código sem estado e sem acesso a API | 1,0 |

---

## 12. Checklist

- [ ] Quatro tipos implementados
- [ ] Botão com `type="button"`
- [ ] `role` correto por estado
- [ ] Botão ausente quando não há `onRetry`
- [ ] Componente sem `useState`/`useEffect`
- [ ] `npm run lint` e `npm run build` sem erros

---

## 13. Referência

Gabarito: `src/components/Feedback.jsx`.
