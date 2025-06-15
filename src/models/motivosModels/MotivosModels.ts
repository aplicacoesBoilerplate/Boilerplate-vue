export interface CategoriasMotivos {
  idCategoria: number
  descricaoCategoria: string
  emergencial: boolean
}

export interface OperacoesMotivos extends CategoriasMotivos {
  descricaoMotivo: string
}

export interface MotivoConsulta extends OperacoesMotivos {
  idMotivo: number
}
