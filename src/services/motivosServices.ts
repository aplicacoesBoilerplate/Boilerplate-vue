// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { MotivoConsulta, OperacoesMotivos } from '@/models/motivosModels/MotivosModels'
// Services
import http from './axios'

export const motivosServices = {
  // Consulta para retornar os motivos cadastrados paginando os mesmos
  async getMotivos(paginador: PaginatorClass): Promise<HeaderPaginatorModel<MotivoConsulta>> {
    try {
      const { data } = await http.get('/motivos/consulta/detalhe', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Retorna apenas um motivo com base no registro do mesmo
  async getMotivoById(idMotivo: number): Promise<MotivoConsulta> {
    try {
      const { data } = await http.get(`/motivos/${idMotivo}/detalhe`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Realizar o cadastro de um mono motivo
  async createMotivo(novoMotivo: OperacoesMotivos): Promise<MotivoConsulta> {
    try {
      const { data } = await http.post(`/motivos`, novoMotivo)
      return data
    } catch (error) {
      throw error
    }
  },

  // Realizar a atualização de um
  async updateMotivo(
    motivoAtualizado: OperacoesMotivos,
    idMotivo: number,
  ): Promise<MotivoConsulta> {
    try {
      const { data } = await http.put(`/motivos/${idMotivo}`, motivoAtualizado)
      return data
    } catch (error) {
      throw error
    }
  },
  // Realiza a exclusão de um motivo, porém como os motivos são FK's, pode ser impedido pelo banco de dados
  async deleteMotivo(idMotivo: number): Promise<void> {
    try {
      const { data } = await http.delete(`/motivos/${idMotivo}`)
      return data
    } catch (error) {
      throw error
    }
  },
}
