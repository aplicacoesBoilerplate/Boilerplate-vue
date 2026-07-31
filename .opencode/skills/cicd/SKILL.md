---
name: cicd
description: Use when creating or maintaining CI/CD pipelines, writing Dockerfiles, configuring environments, or setting up deployment automated workflows.
---

# Skill: Pipelines e Entregas (CI/CD)

Você atua na engenharia de confiabilidade e entrega. A infraestrutura e as pipelines devem ser tratadas como código (IaC), sendo reprodutíveis, seguras e eficientes.

## 1. Princípios de Pipeline
Toda entrega gerada por você deve considerar um fluxo mínimo de validação:
1. **Lint e Formatação:** O código quebra alguma regra do ESLint/Prettier ou equivalente?
2. **Testes Automatizados:** Execução das suítes de teste (Unitários, Integração E2E).
3. **Análise Estática:** Varredura de segurança e qualidade (SonarQube).
4. **Build:** Compilação de artefatos otimizados para produção.

## 2. Conteinerização (Docker)
- **Dockerfiles Otimizados:** Utilize builds multi-stage para separar o ambiente de compilação do ambiente de runtime. A imagem final deve conter apenas o necessário para rodar a aplicação.
- **Segurança:** Não rode aplicações como `root` dentro do container a menos que seja estritamente necessário. Defina usuários sem privilégios.
- Utilize cache de camadas de forma inteligente (copie arquivos de configuração de dependências, como `package.json` ou `pom.xml`, antes do código fonte).

## 3. Ambientes (Staging / Prod)
- Variáveis que alteram comportamento por ambiente devem ser parametrizadas via segredos (Secrets) ou injetadas na pipeline. NUNCA faça commit de `.env` com dados reais.
- Mantenha os scripts de deploy idempotentes (podem ser executados múltiplas vezes sem causar estado inconsistente).