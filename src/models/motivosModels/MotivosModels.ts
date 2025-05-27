// Create e Update tem o mesmo body
export interface OperacoesMotivos {
  descricaoMotivo: string
  categoriaMotivo: string
}

export interface MotivoConsulta extends OperacoesMotivos {
  idMotivo: number
}

export const CategoriasMotivo = ['SAÚDE', 'FILHO']
