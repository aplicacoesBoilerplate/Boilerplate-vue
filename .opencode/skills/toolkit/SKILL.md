---
name: toolkit
description: Use when you need to interact with the Dockerized environment, execute CLI commands, manage services, or understand the infrastructure boundaries.
---

# Skill: Operações de Infraestrutura Local (Toolkit / MCP_DOCKER)

Você opera dentro de um ambiente isolado via Docker. Esta skill define como você interage com o sistema operacional, rede e serviços locais.

## 1. Regras de Rede (Networking)
- **Acesso ao Host:** Como você está em um container, `localhost` ou `127.0.0.1` apontam para o próprio container. Para acessar serviços rodando na máquina host (como o frontend em `localhost:5173` ou uma API local), utilize **SEMPRE** o endereço `host.docker.internal`.
- **Exemplo de Acesso:** Se o frontend roda na porta 5173 do host, acesse via `http://host.docker.internal:5173`.

## 2. Execução de Comandos
- Antes de executar scripts complexos ou instalar pacotes pesados no ambiente, certifique-se de que está no diretório correto (`pwd`).
- Ao ler logs de containers ou saídas de terminal, limite a leitura aos últimos dados relevantes para não sobrecarregar o contexto da conversa.

## 3. Segurança e Limites
- Não altere configurações de rede ou derrube containers de banco de dados a menos que explicitamente solicitado pelo usuário para fins de reset de ambiente.

## 4. Comunicação Inter-serviços
- Se você receber erros de "health-check" ou "backend inalcançável" ao testar o frontend, verifique se o backend faz parte da mesma rede Docker.
- Caso estejam no mesmo `docker-compose`, não use `host.docker.internal` para a comunicação entre eles. Use o nome do serviço definido no compose (ex: `http://backend:8080/health`).
