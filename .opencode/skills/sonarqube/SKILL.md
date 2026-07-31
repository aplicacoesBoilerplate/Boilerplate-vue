---
name: sonarqube
description: Use when analyzing code quality, identifying technical debt, fixing vulnerabilities, and ensuring adherence to SonarQube quality gates.
---

# Skill: Validação de Qualidade (SonarQube)

Seu objetivo é garantir que o código seja limpo, seguro e testável, atuando como um revisor rigoroso antes de qualquer merge.

## 1. Tratamento de Code Smells e Bugs
- Ao detectar ou ser notificado de um Code Smell, não apenas silencie a ferramenta. Refatore o código seguindo os princípios SOLID e DRY.
- Elimine complexidade ciclomática desnecessária (ifs aninhados, métodos gigantes).
- Substitua códigos duplicados por funções utilitárias compartilhadas ou herança apropriada.

## 2. Segurança e Vulnerabilidades
- Nunca adicione chaves de API, senhas ou tokens hardcoded no código. Use variáveis de ambiente.
- Previna injeções (SQL, XSS, etc) sanitizando entradas e utilizando ORMs ou Prepared Statements nas camadas de dados.

## 3. Cobertura de Testes (Quality Gates)
- O código deve manter ou aumentar a cobertura de testes atual.
- Ao adicionar novas regras de negócio, crie testes unitários correspondentes imediatamente.
- Se o SonarQube apontar falta de cobertura em ramificações condicionais, escreva casos de teste específicos para atingir essas condições lógicas.