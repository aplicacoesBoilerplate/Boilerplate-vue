export interface SaidaConsulta {
  idSaida?: number
  idFuncionarioResponsavelSaida: number
  nomeFuncionarioResponsavelSaida: string
  numeroRegistroFuncionario: number
  nomeFuncionario: string
  setorFuncionario: string
  observacaoSaida: string
  statusSaida?: string
  dataSolicitacaoSaida: string
  dataAprovacaoSaida: string
  dataPrevisaoSaidaFuncionario: string
  dataSaidaFuncionario: string
  confirmaRetorno: boolean
  dataPrevisaoChegadaFuncionario: string
  dataChegadaFuncionario: string
  tempoTotalAusente: string
  motivoSaida: number
  descricaoMotivo: string
  categoriaMotivo: string
  idCategoria?: number
  descricaoCategoria?: string
  emergencial?: boolean
}

// Corpo padrão das autorizações
export interface AutorizacoesConsulta {
  idAutorizacao?: number
  idFuncionarioAutorizacao: number
  nomeResponsavel: string
  idSaida: number
  aprovacaoSaida: boolean
  observacaoAutorizacao: string
  dataAutorizacao: string | null
}

// Extende de saída e implementa as demais partes
export interface AutorizacoesSaidaConsulta extends SaidaConsulta {
  idAutorizacao?: number
  idFuncionarioAutorizacao: number
  idSaida: number
  aprovacaoSaida: boolean
  observacaoAutorizacao: string
  dataAutorizacao: string | null
  descricaoMotivo: string
  categoriaMotivo: string
  nomeResponsavel: string
}

// Saídas com uma lista de autorizações
export interface SaidasComAutorizacoes extends SaidaConsulta {
  autorizacoes: Array<AutorizacoesConsulta>
}
