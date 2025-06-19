// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels'
// Services
import http from './axios'

export const firebirdServices = {
    // Consultar uma autorização com base no id do registro das autorizações
  async getRegistroDP(
    search: string,
  ): Promise<HeaderPaginatorModel<funcionarioRegistradoDP>> {
    try {
      const { data } = await http.get(`/funcionario?search=${search}`)
      return data
    } catch (error) {
      throw error
    }
  },
}
