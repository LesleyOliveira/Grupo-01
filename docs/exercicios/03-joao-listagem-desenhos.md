# Exercício 03 — Componente de listagem de desenhos

**Integrante:** João
**Ciclo:** `catalogo-desenhos`
**Tempo estimado:** 45 minutos
**Depende de:** exercício 01 concluído
**É usado por:** exercício 06

---

## 1. Contexto

A listagem precisa exibir os desenhos cadastrados sem saber de onde eles vêm. Se o componente buscar dados por conta própria, ele fica impossível de reutilizar e difícil de testar.

Seu exercício é criar um componente de apresentação: recebe uma lista por `props` e desenha a interface. Quem busca os dados é a página, no exercício 06.

---

## 2. Objetivos de aprendizagem

- criar um componente funcional com `props`;
- renderizar listas com `map` e a prop especial `key`;
- aplicar renderização condicional;
- entender a diferença entre componente de apresentação e componente de container.

---

## 3. Pré-requisitos

- exercício 01 concluído;
- noções básicas de JSX.

---

## 4. Arquivos sob sua responsabilidade

```text
src/components/DesenhoList.jsx
```

Não importe nada de `src/api`. Não use `useState` nem `useEffect` neste componente.

---

## 5. Enunciado

Crie o componente `DesenhoList`, que recebe `desenhos` (array) e exibe, para cada item:

- título em destaque;
- gênero, ano de lançamento e criador em uma linha secundária;
- sinopse apenas quando ela existir e não estiver vazia.

---

## 6. Etapas

### Etapa 1 — Definir o contrato de props

| Prop | Tipo | Obrigatória |
|---|---|---|
| `desenhos` | `Array<{ id, titulo, genero, anoLancamento, criador, sinopse }>` | sim |

### Etapa 2 — Implementar o componente

`src/components/DesenhoList.jsx`:

```jsx
export default function DesenhoList({ desenhos }) {
  return (
    <ul className="desenho-list">
      {desenhos.map((desenho) => (
        <li key={desenho.id} className="desenho-card">
          <h3>{desenho.titulo}</h3>
          <p className="desenho-meta">
            {desenho.genero} - {desenho.anoLancamento} - {desenho.criador}
          </p>
          {desenho.sinopse ? <p>{desenho.sinopse}</p> : null}
        </li>
      ))}
    </ul>
  )
}
```

### Etapa 3 — Entender as decisões

- **`key={desenho.id}`**: o React usa a chave para identificar cada item entre renderizações. Usar o índice do array é considerado má prática quando a lista pode mudar de ordem.
- **`desenho.sinopse ? ... : null`**: uma string vazia é falsy em JavaScript, então o parágrafo não é renderizado. Sem essa condição, apareceria um espaço vazio no card.
- **Sem estado**: como o componente apenas apresenta dados, ele não precisa de hooks. Isso o torna previsível e fácil de reaproveitar.

---

## 7. Comandos para executar

O componente ainda não aparece na tela até o exercício 06. Para validar a sintaxe e o padrão do projeto:

```powershell
cmd /c "npm run lint"
cmd /c "npm run build"
```

Para ver o componente renderizado antes da integração, use um rascunho temporário em `src/App.jsx` (não commite):

```jsx
import DesenhoList from './components/DesenhoList.jsx'

const exemplo = [
  {
    id: 1,
    titulo: 'Avatar: A Lenda de Aang',
    genero: 'Aventura',
    anoLancamento: 2005,
    criador: 'Michael Dante DiMartino e Bryan Konietzko',
    sinopse: 'Aang precisa dominar os quatro elementos.',
  },
  {
    id: 2,
    titulo: 'As Meninas Superpoderosas',
    genero: 'Ação',
    anoLancamento: 1998,
    criador: 'Craig McCracken',
    sinopse: '',
  },
]

export default function App() {
  return <DesenhoList desenhos={exemplo} />
}
```

Depois rode `npm run dev` e desfaça a alteração.

---

## 8. Resultado esperado

Cada desenho aparece em um card com título, linha de metadados e sinopse quando houver:

```text
Avatar: A Lenda de Aang
Aventura - 2005 - Michael Dante DiMartino e Bryan Konietzko
Aang precisa dominar os quatro elementos.

As Meninas Superpoderosas
Ação - 1998 - Craig McCracken
```

O segundo card não deve exibir parágrafo de sinopse.

---

## 9. Casos de validação

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Lista com itens | dois objetos | dois cards renderizados |
| Sinopse vazia | `sinopse: ""` | nenhum parágrafo de sinopse |
| Sinopse preenchida | texto | parágrafo exibido |
| Lista vazia | `[]` | lista vazia, sem erro (a mensagem é responsabilidade do exercício 05) |
| Chave duplicada | dois itens com mesmo `id` | aviso no console do React |

---

## 10. Evidências para entrega

1. Print da tela com os dois cards.
2. Print do console sem avisos de `key`.
3. Saída de `npm run lint` e `npm run build`.
4. Confirmação de que o arquivo não importa nada de `src/api`.

---

## 11. Critérios de avaliação

| Critério | Peso |
|---|---|
| Componente recebe dados apenas por props | 2,5 |
| Campos obrigatórios exibidos corretamente | 2,5 |
| Sinopse condicional | 2,0 |
| Uso correto de `key` | 1,5 |
| Código passa em lint e build | 1,5 |

---

## 12. Checklist

- [ ] Nenhum hook no componente
- [ ] Nenhum import de `src/api`
- [ ] `key` usando `id`
- [ ] Sinopse vazia não gera parágrafo
- [ ] `npm run lint` sem erros
- [ ] `npm run build` conclui

---

## 13. Referência

Gabarito: `src/components/DesenhoList.jsx`.
