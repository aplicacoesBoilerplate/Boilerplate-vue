/**
 * @description Configuração do commitlint para validação de mensagens de commit.
 * @property {string[]} extends - Conjunto de regras base utilizado para validar os commits.
 * @property {Array} rules.typeEnum - Lista de tipos de commit permitidos no projeto.
 * @property {Array} rules.subjectCase - Regra desabilitada para evitar restrição de case no assunto do commit.
 * @property {Array} rules.subjectFullStop - Impede que o assunto do commit termine com ponto final.
 * @property {Array} rules.headerMaxLength - Limite de 120 caracteres para a linha de título do commit.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 120],
  },
};
