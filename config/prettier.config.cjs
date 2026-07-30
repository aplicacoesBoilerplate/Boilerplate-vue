/**
 * @description Configuração do Prettier para formatação consistente de código.
 * @property {number} printWidth - Define o tamanho máximo de caracteres por linha.
 * @property {string} trailingComma - Adiciona vírgulas finais onde possível para facilitar diffs e manutenção.
 * @property {boolean} singleQuote - Utiliza aspas simples em vez de aspas duplas.
 * @property {boolean} semi - Adiciona ponto e vírgula ao final das instruções.
 * @property {number} tabWidth - Tamanho definido para a tabulação/identação.
 * @property {boolean} useTabs - Utiliza tab para tabulação/identação.
 * @property {boolean} bracketSpacing - Adiciona espaços entre chaves em objetos literais.
 * @property {string} arrowParens - Controla a inclusão de parênteses em arrow functions com parâmetro único.
 * @property {string} endOfLine - Define o caractere de fim de linha utilizado (LF para compatibilidade Unix).
 * @property {boolean} singleAttributePerLine - Força um atributo por linha em HTML, Vue e JSX.
 * @property {boolean} bracketSameLine - Mantém o fechamento de tags multi-linha em uma linha separada.
 * @property {boolean} vueIndentScriptAndStyle - Evita indentação extra dentro dos blocos script e style em arquivos Vue.
 */
module.exports = {
  printWidth: 120,
  trailingComma: 'all',
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  singleAttributePerLine: true,
  bracketSameLine: false,
  vueIndentScriptAndStyle: false,
};
