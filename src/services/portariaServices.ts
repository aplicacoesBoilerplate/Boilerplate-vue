// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { SaidasComAutorizacoes } from '@/models/saidasModels/saidasModels'
// Services
import http from './axios'

export const portariaServices = {
  // Consulta paginada com todas as solicitações de saidas
  async getAllSaidas(
    paginador: PaginatorClass,
  ): Promise<HeaderPaginatorModel<SaidasComAutorizacoes>> {
    try {
      const { data } = await http.get('/portaria/consulta', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Lança a data que o usuário saiu, o valor é a data no momento em que a requisição foi efetuada
  async LancarHoraSaida(idSaida: number): Promise<void> {
    try {
      const { data } = await http.put(`/portaria/${idSaida}/saida`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Lança a data que o usuário retornou, o valor é a data no momento em que a requisição foi efetuada
  async LancarHoraRetorno(idSaida: number): Promise<void> {
    try {
      const { data } = await http.put(`/portaria/${idSaida}/retorno`)
      return data
    } catch (error) {
      throw error
    }
  },
}
