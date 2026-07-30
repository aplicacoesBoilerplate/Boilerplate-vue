---
name: mcp
description: Use when using MCP tools such as context7, pen.dev, Playwright, SonarQube, or when configuring CI/CD, deploy pipelines, and testing infrastructure.
---

# Skill: Utilização de MCPs

## 6.1 Prototipagem (pen.dev)

- Utilizar pen.dev para criar protótipos de interface.
- Compartilhar link do protótipo com o usuário para validação.
- Após validação, gerar código da interface usando os recursos do pen.dev.
- Framework e linguagem devem seguir o padrão do projeto.

## 6.2 Consultas (context7)

- Usar Context7 MCP para documentação atualizada de bibliotecas, frameworks, SDKs, APIs.
- Sempre começar com `resolve-library-id`.
- Escolher melhor match por nome, descrição, snippets, reputação e benchmark.
- Fazer `query-docs` com consulta específica por conceito (não combinar conceitos distintos).
- Responder usando a documentação obtida.

## 6.3 Testes automatizados

- **Backend:** Kafka para testes automatizados.
- **Frontend:** Playwright.
- MCPs específicos devem fazer parte das especificações de implementação quando solicitado.

### Instalação do Kafka (para testes)

```bash
# Adicionar ao docker-compose.yml do projeto
```

### Instalação do Playwright

```bash
npm init playwright@latest
npx playwright install
```

## 6.4 Validação de código (SonarQube)

- Usar MCP do SonarQube para validar código.
- Garantir que o código siga padrões de qualidade e segurança.

## 6.5 Deploy e CI/CD

- Entregas devem passar por CI/CD com:
  1. Testes automatizados
  2. Validação de código
  3. Build
  4. Implantação em staging/sandbox
- MCPs recomendados: AWSLabs, GitHub Actions, Jenkins, Cloudflare, Docker, Kubernetes, Terraform.
