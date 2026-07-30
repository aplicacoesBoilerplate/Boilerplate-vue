# Diretrizes Globais para Agentes de IA

Este arquivo contém as regras globais que se aplicam a todos os projetos deste workspace. Regras específicas de tecnologia/domínio estão em skills modulares em `.opencode/skills/`.

---

## 1.1 Linguagem de comunicação

- Toda comunicação com o usuário deve ser em português do Brasil (`pt-BR`).
- Termos técnicos podem ser mantidos em inglês quando forem nomes oficiais de tecnologias, APIs, bibliotecas, padrões ou conceitos amplamente usados pela comunidade.
- As respostas devem priorizar clareza, objetividade e explicação progressiva.
- Quando houver sugestão de código, explicar antes o motivo da abordagem e depois apresentar o exemplo.

---

## 1.2 Nomenclatura (forçada pelo ESLint)

| Contexto        | Padrão                      | Prefixo |
| --------------- | --------------------------- | ------- |
| Types           | `PascalCase`                | `T`     |
| Interfaces      | `PascalCase`                | `I`     |
| Classes         | `PascalCase`                | `C`     |
| Constantes      | `UPPER_CASE` ou `camelCase` | —       |
| Variáveis       | `camelCase` ou `UPPER_CASE` | —       |
| Funções/Métodos | `camelCase`                 | —       |
| Parâmetros      | `camelCase` ou `PascalCase` | `p`     |

Quando o arquivo exportar múltiplos itens fortemente relacionados, o nome deve representar o domínio ou responsabilidade principal.

---

## 1.3 Comentários e documentação interna

Tags JSDoc básicas são forçadas pelo `eslint-plugin-jsdoc` configurado no projeto. As regras abaixo são convenção de projeto (não automatizáveis):

- Comentários devem explicar responsabilidades, contratos e decisões que não sejam imediatamente óbvias.
- Evitar comentários que apenas repetem o nome do símbolo.
- Documentação deve usar JSDoc em bloco único acima da declaração.
- Não documentar atributos individualmente dentro do corpo do type — usar `@property` no bloco pai.
- Comentários inline devem ser reservados para regras de negócio pontuais, workarounds e decisões não óbvias.

---

## 1.4 Tipagem forte

- Evitar `any`.
- Tipar parâmetros, retornos, callbacks, eventos e estruturas de dados.
- Retornos `void` também devem ser declarados quando melhorarem a clareza da assinatura.
- Types, interfaces, classes e enums reutilizáveis devem ser centralizados em diretórios próprios.
- Tipos locais só devem permanecer no arquivo quando forem exclusivos daquele contexto.

---

## 1.5 Separação de responsabilidades

- Services executam integrações externas, chamadas HTTP ou comunicação com infraestrutura.
- Services não manipulam estado visual, snackbar, navegação ou comportamento de tela.
- Camadas próximas da UI podem lidar com loading, snackbar, redirecionamentos e mensagens.
- Components, pages ou controllers não concentram regras reutilizáveis que possam ser extraídas.
- Stores contêm estado compartilhado, não detalhes de componentes específicos.
- Utils e formatters contêm funções puras ou transformações reutilizáveis.

---

## 1.6 DRY e reutilização

Aplicar DRY em: componentes, services, classes, funções, composables, stores, utils, formatters, mixins SCSS, validações, DTOs, models. Sempre que uma regra se repetir, avaliar extração para camada mais apropriada.

---

## 1.7 Types vs Interfaces

- Usar `type` para composições, unions, assinaturas locais e estruturas flexíveis.
- Usar `interface` para contratos de objetos, DTOs, responses e estruturas que representem entidades.

---

## 1.8 Classes

Classes utilitárias devem preferir métodos estáticos quando não houver necessidade real de instância.

---

## 1.9 Arquitetura de Services

Services devem ser encapsulados em classes quando representarem integração ou domínio. Métodos de requisição devem ser estáticos. Devem ter assinatura clara, capturar erro apenas para repassar, e não conhecer UX.

### Requisições paginadas

Métodos com muitos parâmetros devem receber um objeto tipado.

### Formatters

Formatadores de dados devem ser centralizados em uma classe utilitária com métodos estáticos para transformações recorrentes (datas, booleanos, moeda, etc.).

---

## 2. Skills disponíveis

Carregue a skill correspondente ao domínio da tarefa:

| Skill      | Quando ativar                                                                |
| ---------- | ---------------------------------------------------------------------------- |
| `vue`      | Trabalhando com Vue 3, Vuetify, Pinia, composables, componentes              |
| `mcp`      | Usando MCPs (context7, pen.dev, Playwright, SonarQube) ou configurando CI/CD |
| `backend`  | Trabalhando com Java, Spring Boot, APIs REST                                 |
| `entregas` | Executando tarefas de entrega: testes, build, lint, setup de ferramentas     |
