// Arquivo de configuracao do Prettier, ferramenta para formatacao de codigo.
module.exports = {
  // Define o tamanho maximo de caracteres por linha.
  printWidth: 120,

  // Adiciona virgulas finais onde possivel para facilitar diffs e manutencao.
  trailingComma: "all",

  // Utiliza aspas simples em vez de aspas duplas.
  singleQuote: true,

  // Adiciona ponto e virgula ao final das instrucoes.
  semi: true,

  // Forca um atributo por linha em HTML, Vue e JSX.
  singleAttributePerLine: true,

  // Mantem o fechamento de tags multi-linha em uma linha separada.
  bracketSameLine: false,

  // Evita indentacao extra dentro dos blocos <script> e <style> em arquivos Vue.
  vueIndentScriptAndStyle: false
}
