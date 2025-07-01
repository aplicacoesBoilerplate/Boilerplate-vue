// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { Dashboard } from '@/models/relatoriosModels/relatoriosModels'
// Services
import http from './axios'

export const relatoriosServices = {

  // Consulta dos dados para os indicadores no dashboard, classe de paginacao usada apenas para envio dos parâmetros
  async getDashboard(paginador: PaginatorClass): Promise<Dashboard> {
    try {
      const { data } = await http.get('/relatorios/dashboard', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },
}
