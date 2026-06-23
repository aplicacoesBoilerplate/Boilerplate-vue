// Arquivo de configuracao do ESLint, ferramenta para lintagem de codigo.
module.exports = {
  // Conjuntos de regras-base usados pelo ESLint.
  extends: [
    // Ativa regras recomendadas para projetos Vue 3.
    "plugin:vue/vue3-recommended",

    // Ativa regras recomendadas gerais do ESLint para JavaScript.
    "eslint:recommended",

    // Desativa regras que entram em conflito com o Prettier.
    "prettier"
  ],

  // Regras especificas sobrescritas para este projeto.
  rules: {
    // Controla se atributos de componentes Vue devem usar kebab-case ou camelCase.
    "vue/attribute-hyphenation": [
      // Trata violações desta regra como erro.
      "error",

      // Impede o uso obrigatorio de kebab-case, permitindo camelCase.
      "never",

      {
        // Lista de atributos que devem ser ignorados por esta regra.
        ignore: []
      }
    ]
  }
}
