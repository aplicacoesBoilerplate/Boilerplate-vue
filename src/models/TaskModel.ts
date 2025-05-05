export interface TaskModel {
  idTask: number
  titulo: string
  descricao: string
  emExecucao: boolean
  statusTaskId: number
  relevanciaTaskId: number
  usuarioEmissorId: number
  usuarioAtribuidoId: number
  criadoEm: Date
  previsaoInicio: Date
  inicio: Date
  alteradoEm: Date
  previsaoTermino: Date
  termino: Date
}

export interface TaskDialog {
  id: number
  title: string
  description: string
  idEmployee: number
  estimatedDelivery: string
  dateDelivery: string
  status: string
}
