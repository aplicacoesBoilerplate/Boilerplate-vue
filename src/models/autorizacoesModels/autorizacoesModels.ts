// O mesmo body será utilizado para o update, o create fica a cargo do sistema
export interface autorizacoes {
  idAutorizacao: number
  idFuncionarioAutorizacao: number
  aprovacaoSaida: boolean
  observacaoAutorizacao: string
  dataAutorizacao: string
  idSaida: number
}
