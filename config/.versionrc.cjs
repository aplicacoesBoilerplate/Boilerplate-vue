/**
 * @description Configuração do standard-version para geração automatizada de changelog e versionamento semântico.
 * @property {string} releaseCommitMessageFormat - Formato da mensagem gerada automaticamente durante o release.
 * @property {Array} types - Lista de tipos de commit que definem as seções exibidas no CHANGELOG.
 * @property {string} types[].type - Identificador do tipo de commit mapeado.
 * @property {string} types[].section - Nome da seção exibida no CHANGELOG para este tipo.
 * @property {boolean} [types[].hidden] - Quando true, oculta este tipo do CHANGELOG.
 */
module.exports = {
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance' },
    { type: 'refactor', section: 'Refactoring' },
    { type: 'docs', section: 'Documentation' },
    { type: 'build', section: 'Build System' },
    { type: 'ci', section: 'Continuous Integration' },
    { type: 'test', section: 'Tests' },
    { type: 'style', section: 'Styles' },
    { type: 'chore', section: 'Maintenance', hidden: true },
  ],
};
