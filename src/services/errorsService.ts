// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { ErrorsConsulta } from '@/models/errorsModels/errorsModels'
// Services
import http from './axios'

export const errorsServices = {
  // Consultar uma autorização com base no id do registro das autorizações
  async getErrorsConsulta(
    paginador: PaginatorClass,
  ): Promise<HeaderPaginatorModel<ErrorsConsulta>> {
    try {
      const { data } = await http.get('/errors/consulta', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },
}
