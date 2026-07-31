---
name: playwright
description: Use when you need to inspect the DOM visually, extract computed CSS styles, run automated E2E tests, or validate layout behavior in the browser.
---

# Skill: Análise de DOM e Testes (Playwright)

O Playwright é a sua ferramenta para "enxergar" a aplicação. Como IAs não possuem visão espacial direta, você dependerá dele para analisar como o código está sendo renderizado no navegador.

## 1. Navegação e Inspeção
- **Acesso:** Utilize a URL correta do ambiente de desenvolvimento. Se estiver utilizando o MCP_DOCKER, lembre-se de usar `http://host.docker.internal:[PORTA]`.
- **Inspeção de Elementos:** Quando o usuário relatar um problema de layout (ex: "os botões estão sobrepostos"), navegue até a página e inspecione a árvore do DOM.
- **Computed Styles:** Extraia as propriedades reais renderizadas pelo navegador (Computed Styles) e as dimensões (Bounding Client Rect) dos elementos problemáticos para embasar o cálculo de Box Model e Flexbox/Grid.

## 2. Testes E2E (Fase Atual)
- Se solicitado para criar testes automatizados de frontend, inicialize ou utilize a suíte do Playwright no padrão do projeto.
- Valide fluxos críticos: cliques, preenchimento de formulários, estados de erro e presença de elementos chaves (como modais).

## 3. Fluxo de Correção de UI
1. Acesse a URL da página alvo.
2. Identifique os seletores dos elementos problemáticos.
3. Extraia as regras CSS ativas.
4. Proponha a correção no código `.vue` baseada nos dados reais (e não em suposições).

## 4. Isolamento de Frontend (Mocking)
- Se a aplicação falhar ao carregar devido a dependências de backend (como "health-check falhou"), **não desista**. 
- Utilize a API de roteamento do Playwright (`page.route()`) para interceptar requisições falhas e retornar um mock de sucesso (Status 200) com um payload genérico, permitindo que a interface seja renderizada para análise visual.
