# README.md (modelo)

## Projeto e integrantes

**Tema:** Catálogo de desenhos animados.  
**Problema que resolve:** centraliza listagem e cadastro de desenhos com validação no cliente e feedback claro de erro/sucesso, facilitando o consumo de uma API HTTP em um fluxo completo de front-end.

**Integrantes:**

- Alexandre
- Mauro
- João
- Tiago
- Claudiana
- Lesley

## Framework utilizado

O grupo utilizou o **OpenSpec** como framework de trabalho (spec-driven) para planejar, dividir e validar as entregas, e **React + Vite** para implementação do front-end.

**Por que foi escolhido:**

- OpenSpec: Já era conhecido pelo grupo, permite organizar tarefas, planos e specs de forma clara e rastreável.
- React + Vite: setup simples, desenvolvimento rápido e boa separação por componentes. Além disso, são os frameworks ensinados na disciplina, facilitando a avaliação do professor.

## Como rodar

Pré-requisito: **Node.js 20+**

```bash
npm install
```

Terminal 1 (API mock com json-server, porta 3001):

```bash
npm run server
```

Terminal 2 (front-end):

```bash
npm run dev
```

Opcional: criar `.env` com o valor:

```env
VITE_API_URL=http://localhost:3001
```

## Onde estão os artefatos

- **Spec principal:** `openspec/specs/catalogo-desenhos/spec.md`
- **Spec complementar (feedback):** `openspec/specs/feedback-estados/spec.md`
- **Plano (design):** `openspec/changes/archive/2026-11-22-catalogo-desenhos/design.md`
- **Tarefas do ciclo:** `openspec/changes/archive/2026-11-22-catalogo-desenhos/tasks.md`
- **Plano/tarefas por exercício:** `docs/exercicios/`

**Quem fez cada tarefa (resumo):**

- Alexandre: base do projeto, dependências, mock (`db.json`), `server`, `.env.example`
- Mauro: integração final/página/layout (`src/pages/CatalogoDesenhos.jsx`, `src/App.jsx`, `src/App.css`)
- João: listagem (`src/components/DesenhoList.jsx`)
- Tiago: formulário e validação (`src/components/DesenhoForm.jsx`, `src/components/validarDesenho.js`)
- Claudiana: feedback de estado (`src/components/Feedback.jsx`)
- Lesley: camada de API (`src/api/apiClient.js`, `src/api/desenhosApi.js`)

## Reflexão

- **Que decisão o agente teria tomado sozinho e a spec evitou?**  
  A escolha de tecnologias, provavelmente escolhendo outras opções de front-end (Angular, Vue, etc.) ou de mock (MSW, MirageJS, etc.), podendo até fazer um backend próprio separado com outras tecnologias como Java, Python, etc. Além disso, ela poderia ter escolhido uma arquitetura e padrões de projeto diferentes, que poderiam ter tornado o projeto mais complexo.

- **Que inconsistência a validação encontrou? Estava na spec ou no código?**  
  Foi encontrada inconsistência de porta (`.env.example` em 3000 vs plano em 3001) e baseline do `db.json` com registro extra, ambas no código/configuração. Também foi encontrada uma lacuna na spec: após um cadastro bem-sucedido, um envio inválido mantinha a mensagem de sucesso na tela. A spec foi atualizada antes da correção no código (tarefa 6.5).

- **Como o framework ajudou (ou atrapalhou) a coordenação do grupo?**  
  Ajudou ao definir contratos de props, ordem de execução, responsabilidades por arquivo e acelerou o desenvolvimento do código. Em contrapartida, atrapalhou na manutenção de artefatos paralelos (mudanças arquivadas exigem disciplina de sincronização), aumentando a complexidade da gestão do projeto.

- **O que fariam diferente com outro framework?**  
  Provavelmente seguiríamos os passos essenciais do SDD, planejando, validando e aplicando as specs, mas seguindo os padrões do framework escolhido, que poderiam ser diferentes. Por exemplo, se fosse Angular, poderíamos ter usado serviços e injeção de dependência para a API. Utilizando um backend próprio, poderíamos ter usado Java Spring Boot para a API, com validação e autenticação, e o front-end consumiria a API RESTful. Em relação ao OpenSpec, poderíamos ter usado o SpecKit do github, que possui comandos e fluxos diferentes mas, essencialmente, o mesmo objetivo de organizar e validar as entregas do projeto.
