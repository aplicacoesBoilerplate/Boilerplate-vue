// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { AutorizacoesConsulta } from '@/models/saidasModels/saidasModels'
// Services
import http from './axios'

export const autorizacoesServices = {
  // Consultar uma autorização com base no id do registro das autorizações
  async getAutorizacaoById(idAutorizacao: number): Promise<AutorizacoesConsulta> {
    try {
      const { data } = await http.get(`/autorizacoes/${idAutorizacao}`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Consultar uma autorização com base no id do registro das saídas
  async getAutorizacaoBySaida(idSaida: number): Promise<AutorizacoesConsulta> {
    try {
      const { data } = await http.get(`/autorizacoes/saida/${idSaida}`)
      return data
    } catch (error) {
      throw error
    }
  },

  // Consulta geral para as autorizações, aceita diversos parâmetros da paginação além de dois opcionais para status e responsável
  async getAutorizacoes(paginador: PaginatorClass): Promise<HeaderPaginatorModel<AutorizacoesConsulta>> {
    try {
      const { data } = await http.get('/autorizacoes/consulta', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Método que será utilizado para modificar as autorizações, seja a permissão ou bloqueio
  async atualizarAutorizacao(autorizacaoAtualizada: AutorizacoesConsulta, idAutorizacao?: number) {
    try {
      if (idAutorizacao != null) {
        const { data } = await http.put(`/autorizacoes/${idAutorizacao}`, autorizacaoAtualizada)
        return data
      }
    } catch (error) {
      throw error
    }
  }
}
