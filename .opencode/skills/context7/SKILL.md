---
name: context7
description: Use when you need to fetch, read, or validate up-to-date documentation for libraries, frameworks, SDKs, or APIs (e.g., Vue, Vuetify, Tailwind).
---

# Skill: Consultas à Documentação (Context7)

Você tem acesso ao Context7, uma ferramenta para buscar as documentações oficiais mais atualizadas e evitar "alucinações" de código legado ou sintaxes obsoletas.

## 1. Fluxo Obrigatório de Busca

- **Passo 1:** Sempre comece utilizando a ação `resolve-library-id` para encontrar o ID correto da tecnologia (ex: "vuetify", "vue").
- **Passo 2:** Escolha o melhor _match_ retornado, avaliando o nome, descrição e relevância para o ecossistema do projeto.
- **Passo 3:** Utilize a ação `query-docs` informando o ID da biblioteca e a sua dúvida específica.

## 2. Regras de Ouro para Queries

- **Seja Específico:** Ao fazer o `query-docs`, faça consultas por um conceito ou componente por vez (ex: "v-data-table server side pagination"). Não misture múltiplos conceitos na mesma busca.
- **Priorize a Fonte da Verdade:** Nunca invente propriedades para componentes (especialmente em Vuetify ou Vue). Se você não tem 100% de certeza se uma `prop` existe, consulte o Context7 antes de gerar o código.
- **Implementação Direta:** Ao responder, utilize os snippets e exemplos práticos trazidos pela documentação para embasar sua solução.
