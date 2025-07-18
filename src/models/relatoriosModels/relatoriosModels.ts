// Dashboard home page
export interface Dashboard {
  totalSaidas: number
  funcionariosAusentes: number
  retornosPendentes: number
  aguardandoAutorizacao: number
}

// Relatórios
export interface Relatorios {
  tipoRelatorio: 'SINTETICO' | 'ANALITICO'
  modeloRelatorio:
    | 'GERAL'
    | 'USUARIO'
    | 'FUNCIONARIO'
    | 'SAIDA'
    | 'AUTORIZACAO'
    | 'CATEGORIA'
    | 'MOTIVO'
    | 'ERROS'
}

// Filtros aplicados
export interface FiltrosDoRelatorio {
  showFiltro: boolean
  tabela: string
  campoTabela: string
  searchRegistro: string
  intervaloRegistros: string[]
  condicao:
    | 'SELECAO'
    | 'INTERVALO'
    | 'INICIADO_COM'
    | 'TERMINADO_COM'
    | 'CONTEM'
    | 'IGUAL'
    | 'DIFERENTE'
    | 'MAIOR'
    | 'MAIOR_IGUAL'
    | 'MENOR'
    | 'MENOR_IGUAL'
    | 'SEM_FILTRO'
}

// Tipagem da lista
interface autoComplete {
  chave: string
  valor: string
  icon: string
}

export const CondicoesFiltrosAutoComplete: Array<autoComplete> = [
  { chave: 'SELECAO', valor: 'SELECAO', icon: 'mdi-selection-ellipse' },
  { chave: 'INTERVALO', valor: 'INTERVALO', icon: 'mdi-ray-start-end' },
  { chave: 'INICIADO COM', valor: 'INICIADO_COM', icon: 'mdi-contain-start' },
  { chave: 'TERMINADO COM', valor: 'TERMINADO_COM', icon: 'mdi-contain-end' },
  { chave: 'CONTEM', valor: 'CONTEM', icon: 'mdi-contain' },
  { chave: 'IGUAL', valor: 'IGUAL', icon: 'mdi-equal' },
  { chave: 'DIFERENTE', valor: 'DIFERENTE', icon: 'mdi-not-equal-variant' },
  { chave: 'MAIOR QUE', valor: 'MAIOR', icon: 'mdi-greater-than' },
  { chave: 'MAIOR OU IGUAL', valor: 'MAIOR_IGUAL', icon: 'mdi-greater-than-or-equal' },
  { chave: 'MENOR QUE', valor: 'MENOR', icon: 'mdi-less-than' },
  { chave: 'MENOR OU IGUAL', valor: 'MENOR_IGUAL', icon: 'mdi-less-than-or-equal' },
  { chave: 'NÃO FILTRAR', valor: 'SEM_FILTRO', icon: 'mdi-filter-off' },
]
