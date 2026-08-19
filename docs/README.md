# Documentacao de arquitetura

| Artefato                                                | Finalidade                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [MER do banco](./mer-banco-dados.mmd)                   | Modelo entidade-relacionamento proposto para usuarios, RBAC, preferencias e erros. |
| [Classes do frontend](./diagrama-classes-frontend.mmd)  | Hierarquia real das classes de servico e suas dependencias.                        |
| [Fluxo de comunicacao](./fluxo-comunicacao-classes.mmd) | Comunicacao entre views, stores, composables, servicos e API.                      |
| [Versionamento Java](./versionamento-aplicacao-java.md) | Politica SemVer, commits e releases para o backend.                                |

## Qualidade e segurança

Use `npm run verify` para o gate completo e `npm run test:memory` para o soak de retenção. O orçamento de produção está em `config/bundle-budget.json`; alterações de dependência não devem ampliar esse arquivo sem medição e justificativa.

## Fonte e limites

Os diagramas foram extraidos dos contratos e da implementacao presentes neste repositorio Vue. O MER e uma proposta logica: o backend Java, suas entidades JPA e migrations Flyway nao estao presentes localmente, portanto nomes fisicos, tipos, indices e regras de exclusao devem ser validados antes de virarem schema executavel.

O arquivo `boilerplate.pen` continua sendo a fonte do desenho da interface. O editor Pencil nao estava acessivel durante esta atualizacao, por isso o arquivo nao foi alterado para evitar corromper o design.
