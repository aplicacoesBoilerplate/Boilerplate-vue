// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { SaidaConsulta as Saida } from '@/models/saidasModels/saidasModels'
// Services
import http from './axios'

export const saidasServices = {
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

  // Consultar uma saída pelo id de registro
  async getSaidaById(idSaida: number): Promise<Saida> {
    try {
      const { data } = await http.get(`/saidas/${idSaida}`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Consultar as saídas solicitadas por um usuário
  async getSaidaByFuncionario(paginator: PaginatorClass): Promise<HeaderPaginatorModel<Saida>> {
    try {
      const { data } = await http.get('/saidas/funcionario', {
        params: paginator,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Registrar uma nova saída para o funcionário
  async novaSaida(novaSaida: Saida): Promise<Saida> {
    try {
      const { data } = await http.post('/saidas', novaSaida)
      return data
    } catch (error) {
      throw error
    }
  },

  // Atualizar uma saída
  async atualizarSaida(saidaAtualizada: Saida, idSaida?: number): Promise<Saida> {
    try {
      const { data } = await http.put(`/saidas/${idSaida}`, saidaAtualizada)
      return data
    } catch (error) {
      throw error
    }
  },

  // Remover saída
  async deleteSaida(idSaida: number): Promise<Saida> {
    try {
      const { data } = await http.delete(`/saidas/${idSaida}`)
      return data
    } catch (error) {
      throw error
    }
  },
}
