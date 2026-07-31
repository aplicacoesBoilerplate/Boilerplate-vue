---
name: kafka
description: Use when interacting with Apache Kafka for messaging, event-driven architecture, or automated tests involving topic consumption/production.
---

# Skill: Mensageria e Eventos (Kafka)

Você está lidando com a camada de mensageria assíncrona. Seu objetivo é garantir a comunicação correta entre microserviços e a robustez dos testes baseados em eventos.

## 1. Padrões de Mensageria
- **Nomenclatura de Tópicos:** Siga o padrão do domínio do projeto (ex: `dominio.entidade.evento`).
- **Contratos (Schemas):** Eventos são imutáveis. Ao criar ou modificar produtores/consumidores, respeite o contrato de payload esperado (JSON/Avro) para não quebrar a compatibilidade.

## 2. Testes Automatizados com Kafka
- Utilize containers efêmeros (como Testcontainers no Java) ou a infraestrutura do Docker Compose (via Toolkit) para subir instâncias locais do Kafka.
- Em testes, garanta que os tópicos sejam limpos ou recriados para evitar poluição de estado entre os cenários de teste.
- Valide sempre: (1) Se a mensagem foi produzida corretamente, e (2) Se o consumidor processou a mensagem sem lançar exceções não tratadas.

## 3. Infraestrutura Local (Docker Compose)
Se precisar gerenciar o Kafka localmente para debugar, lembre-se que os brokers e o Zookeeper (ou Kraft) operam em portas específicas (geralmente 9092). Use a skill `toolkit` caso precise verificar os logs do container do Kafka.