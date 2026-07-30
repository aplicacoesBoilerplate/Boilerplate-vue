---
name: entregas
description: Use when running delivery tasks such as running tests, linting, type-check, build, or setting up ESLint, Prettier, commitlint, Husky, and validating code quality.
---

# Skill: Entregas

## 7.1 Testes automatizados

Implementações de recursos, refatorações ou integrações devem conter testes automatizados:

- **Backend:** Kafka para testes.
- **Frontend:** Playwright.
- Novos recursos: criar casos de teste.
- Refatorações: criar casos de teste para validar a mudança.

## 7.2 Validação de código

- Usar MCP do SonarQube para validação de qualidade e segurança.
- Executar ESLint para o frontend.

## 7.3 Validações finais

- Type-check.
- Validação da aplicação em docker-compose.yml.
- Consoles sem erros.
- Testes automatizados executando com sucesso no compose.

## 7.4 Build

Toda entrega deve ser acompanhada de build de código (frontend e/ou backend).

## 7.5 Garantias

Garantir que todas as tarefas foram executadas, estão funcionais e em conformidade com as especificações.

---

# Setup de Ferramentas

## ESLint + Prettier

```bash
npm install -D eslint eslint-plugin-vue prettier eslint-config-prettier \
  eslint-plugin-prettier @eslint/js globals typescript typescript-eslint
```

Scripts no `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write"
  }
}
```

## Commitlint + Husky

```bash
npm install -D @commitlint/cli @commitlint/config-conventional husky
npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

Script no `package.json`:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

## Arquivos de configuração padronizados

Disponíveis em: https://github.com/gersonfribeiro/dev-configurations/tree/main/settings

- ESLint (`.eslintrc.cjs`)
- Prettier (`prettier.config.cjs`)
- commitlint (`commitlint.config.cjs`)
- EditorConfig (`.editorconfig`)
- VSCode Settings
