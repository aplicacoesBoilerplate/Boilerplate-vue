import type { ErrorsConsulta } from "../errorsModels/errorsModels"
import type { UsuarioConsulta } from "../usersModels/UsuariosModels"
import type { funcionarioRegistradoDP } from "../firebirdModels/firebirdModels"
import type { CategoriasMotivos, MotivoConsulta } from "../motivosModels/MotivosModels"
import type { AutorizacoesConsulta, SaidaConsulta, SaidasComAutorizacoes } from "../saidasModels/saidasModels"

// Versão
export interface Version {
  version: string
  updateIn: string
}

// Dashboard home page
export interface Dashboard {
  totalSaidas: number
  funcionariosAusentes: number
  retornosPendentes: number
  aguardandoAutorizacao: number
}

// Relatórios
export interface Relatorios {
  tipoRelatorio: 'SINTETICO' | 'ANALITICO' | undefined
  modeloRelatorio:
    | 'GERAL'
    | 'USUARIO'
    | 'FUNCIONARIO'
    | 'SAIDA'
    | 'AUTORIZACAO'
    | 'CATEGORIA'
    | 'MOTIVO'
    | 'ERROS'
    | undefined
}

// Filtros aplicados
export interface FiltrosDoRelatorio {
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
    | 'VERDADEIRO'
    | 'FALSO'
    | 'SEM_FILTRO'
    | null
}

export interface PossiveisFiltrosDoCampo {
  valor: string,
  chave: string
  tipo: string,
  condicoes: string[]
}

export interface AautoCompleteCondicoes {
  chave: string
  valor: string
  icon: string
}

export const CondicoesFiltrosAutoComplete: Array<AautoCompleteCondicoes> = [
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
  { chave: 'QUANDO VERDADEIRO', valor: 'VERDADEIRO', icon: 'mdi-check-circle-outline' },
  { chave: 'QUANDO FALSO', valor: 'FALSO', icon: 'mdi-close-circle-outline' },
  { chave: 'NÃO FILTRAR', valor: 'SEM_FILTRO', icon: 'mdi-filter-off' },
]

export interface ParametrosGerarRelatorio {
  modeloRelatorio: string,
  tipoRelatorio: string,
  filtrosPorCampo: FiltrosDoRelatorio[]
}

export interface AnaliticoGeral {
  informacoesSaidasComAutorizacoes: SaidasComAutorizacoes[]
}

export interface RelatorioSintetico {
  descricao: string,
  valor: string,
}

export interface RelatorioGerado {
    modeloRelatorio: string,
    tipoRelatorio: string,
    responsaveis?: UsuarioConsulta[],
    funcionario?: funcionarioRegistradoDP[],
    saidas?: SaidaConsulta[],
    autorizacoes?: AutorizacoesConsulta[],
    saidasComAutorizacoes?: SaidasComAutorizacoes[],
    categorias?: CategoriasMotivos[],
    motivos?: MotivoConsulta[],
    errors?: ErrorsConsulta[],
    respostaSinteticaRelatorios?: RelatorioSintetico[],
    analiticoGeral?: AnaliticoGeral
}
