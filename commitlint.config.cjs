// Arquivo de configuracao do Conventional Commits.
module.exports = {
  // Utiliza o config padrao do conventional commits.
  extends: ['@commitlint/config-conventional'],

  rules: {
    // O tipo deve ser uma das opcoes abaixo.
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],

    // O assunto nao deve seguir um padrao de case.
    'subject-case': [0],

    // O assunto nao deve terminar com ponto.
    'subject-full-stop': [2, 'never', '.'],

    // O assunto deve ter no maximo 120 caracteres.
    'header-max-length': [2, 'always', 120],
  },
};
