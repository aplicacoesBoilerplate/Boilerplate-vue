// Arquivo de configuração para o standard-version
module.exports = {
  // Formato da mensagem gerada automaticamente durante o release.
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',

  // Tipos de commits exibidos no CHANGELOG.
  types: [
    {
      // Novas funcionalidades.
      type: 'feat',
      section: 'Features',
    },

    {
      // Correções de bugs.
      type: 'fix',
      section: 'Bug Fixes',
    },

    {
      // Melhorias de desempenho.
      type: 'perf',
      section: 'Performance',
    },

    {
      // Refatorações sem alteração de comportamento.
      type: 'refactor',
      section: 'Refactoring',
    },

    {
      // Alterações de documentação.
      type: 'docs',
      section: 'Documentation',
    },

    {
      // Alterações de build.
      type: 'build',
      section: 'Build System',
    },

    {
      // Alterações em pipelines e integração contínua.
      type: 'ci',
      section: 'Continuous Integration',
    },

    {
      // Inclusão ou alteração de testes.
      type: 'test',
      section: 'Tests',
    },

    {
      // Ajustes de estilo e formatação.
      type: 'style',
      section: 'Styles',
    },

    {
      // Tarefas de manutenção não relevantes para o changelog.
      type: 'chore',
      section: 'Maintenance',
      hidden: true,
    },
  ],
};
