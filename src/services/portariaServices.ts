// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { AutorizacoesSaidaConsulta, SaidaConsulta as Saida } from '@/models/saidasModels/saidasModels'
// Services
import http from './axios'

export const portariaServices = {
  // Consulta paginada com todas as solicitações de saidas
  async getAllSaidas(paginador: PaginatorClass): Promise<HeaderPaginatorModel<Saida>> {
    try {
      const { data } = await http.get('/saidas/consulta', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Retorna a saída com todas as suas autorizações
  async getAutorizacoesSaida(idSaida: number): Promise<AutorizacoesSaidaConsulta> {
    try {
      const { data } = await http.get(`/portaria/consulta/${idSaida}`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Lança a data que o usuário saiu, o valor é a data no momento em que a requisição foi efetuada
  async LancarHoraSaida(idSaida: number): Promise<AutorizacoesSaidaConsulta> {
    try {
      const { data } = await http.get(`/portaria/${idSaida}/saida`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Lança a data que o usuário retornou, o valor é a data no momento em que a requisição foi efetuada
  async LancarHoraRetorno(idSaida: number): Promise<AutorizacoesSaidaConsulta> {
    try {
      const { data } = await http.get(`/portaria/${idSaida}/retorno`)
      return data
    } catch (error) {
      throw error
    }
  },
}
