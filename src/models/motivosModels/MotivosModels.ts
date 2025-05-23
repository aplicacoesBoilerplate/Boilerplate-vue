export interface MotivoConsulta extends OperacoesMotivos {
  idMotivo: number
}

// Create e Update tem o mesmo body
export interface OperacoesMotivos {
  descricaoMotivo: string
  categoriaMotivo: string
}
