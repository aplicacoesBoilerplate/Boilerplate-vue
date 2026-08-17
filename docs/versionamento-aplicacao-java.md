# Versionamento da aplicacao Java

## Objetivo

O backend Java deve usar Semantic Versioning (SemVer) no formato `MAJOR.MINOR.PATCH`.
A versao publicada deve ser a mesma no `pom.xml`, na tag Git, no artefato Maven e na GitHub Release.

| Alteracao                  | Incremento | Exemplo              |
| -------------------------- | ---------- | -------------------- |
| Correcao compativel        | PATCH      | `1.4.2` para `1.4.3` |
| Nova capacidade compativel | MINOR      | `1.4.2` para `1.5.0` |
| Quebra de contrato publico | MAJOR      | `1.4.2` para `2.0.0` |

Pre-releases usam sufixo: `2.0.0-rc.1`, `2.0.0-beta.1` ou `2.0.0-SNAPSHOT` durante o desenvolvimento Maven.

## Commits e releases

Os commits devem seguir Conventional Commits. A automacao de release interpreta esses tipos:

| Commit                                                   | Efeito na versao       |
| -------------------------------------------------------- | ---------------------- |
| `fix:`                                                   | PATCH                  |
| `feat:`                                                  | MINOR                  |
| `feat!:` ou rodape `BREAKING CHANGE:`                    | MAJOR                  |
| `docs:`, `test:`, `refactor:`, `build:`, `ci:`, `chore:` | Sem release por padrao |

Exemplos validos:

```text
fix(auth): validar codigo OTP expirado
feat(rbac): permitir permissao por rota
feat(api)!: substituir campo papel por cargoId
```

## Fluxo de entrega

1. Desenvolver em branch curta a partir de `main`.
2. Abrir pull request com commits convencionais e atualizar contratos quando houver impacto na API.
3. A CI executa `./mvnw -B verify`.
4. Depois do merge em `main`, a automacao cria ou atualiza a pull request de release com `CHANGELOG.md` e a versao do `pom.xml`.
5. A aprovacao e merge da pull request de release criam a tag `vMAJOR.MINOR.PATCH` e a GitHub Release.
6. A publicacao de JAR ou imagem Docker usa exclusivamente a tag criada.

## Regras de compatibilidade

- A API publica deve ser versionada por URL, inicialmente em `/api/v1`.
- Alteracoes incompativeis exigem `/api/v2` durante a janela de migracao e uma entrada no changelog.
- Migrations Flyway usam numeracao propria e imutavel: `V1__descricao.sql`; elas nao seguem a versao SemVer.
- Nao publicar artefatos com versao manual diferente da tag ou do `pom.xml`.

## Adocao no backend

Este repositorio nao contem o projeto Java nem o seu `pom.xml`. Ao integrar esta politica, configurar uma unica propriedade de versao no `pom.xml` e uma automacao de releases, como Release Please, para alterar essa propriedade e gerar o changelog a partir dos Conventional Commits.
