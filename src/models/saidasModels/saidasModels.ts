export interface SaidaConsulta {
  idSaida?: number
  idFuncionarioResponsavelSaida: number
  numeroRegistroFuncionario: number
  nomeFuncionario: string
  setorFuncionario: string
  motivoSaida: number
  observacao_saida: string
  statusSaida?: number
  dataSolicitacaoSaida: string
  dataAprovacaoSaida: string
  dataPrevisaoSaidaFuncionario: string
  dataSaidaFuncionario: string
  confirmaRetorno: boolean
  dataPrevisaoChegadaFuncionario: string
  dataChegadaFuncionario: string
}

export interface AutorizacoesConsulta {
  idAutorizacao?: number
  idFuncionarioAutorizacao: number
  idSaida: number
  aprovacaoSaida: boolean
  observacaoAutorizacao: string
  dataAutorizacao: string | null
}

export interface AutorizacoesSaidaConsulta {
  autorizacao: AutorizacoesConsulta
  saida: SaidaConsulta
}
