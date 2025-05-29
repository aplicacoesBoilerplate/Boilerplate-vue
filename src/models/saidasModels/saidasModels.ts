export interface SaidaConsulta {
  idSaida?: number
  idFuncionarioResponsavelSaida: number
  nomeFuncionarioResponsavelSaida: string
  numeroRegistroFuncionario: number
  nomeFuncionario: string
  setorFuncionario: string
  observacao_saida: string
  statusSaida?: number
  dataSolicitacaoSaida: string
  dataAprovacaoSaida: string
  dataPrevisaoSaidaFuncionario: string
  dataSaidaFuncionario: string
  confirmaRetorno: boolean
  dataPrevisaoChegadaFuncionario: string
  dataChegadaFuncionario: string
  motivoSaida: number
  descricaoMotivo: string
  categoriaMotivo: string
}

export interface AutorizacoesConsulta {
  idAutorizacao?: number
  idFuncionarioAutorizacao: number
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
