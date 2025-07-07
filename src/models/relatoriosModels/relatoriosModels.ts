// Dashboard home page
export interface Dashboard {
  totalSaidas: number
  funcionariosAusentes: number
  retornosPendentes: number
  aguardandoAutorizacao: number
}

// Relatórios
export interface Relatorios {
  tipo: "SINTETICO" | "ANALITICO"
  modelo: "GERAL" | "USUARIO" | "FUNCIONARIO" | "SAIDA" | "AUTORIZACAO" | "CATEGORIA" | "MOTIVO" | "ERROS"
}
