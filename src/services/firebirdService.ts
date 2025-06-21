// Classes
// Models
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels'
// Services
import http from './axios'

export const firebirdServices = {
    // Consultar uma autorização com base no id do registro das autorizações
  async getRegistroDP(
    search: string,
  ): Promise<Array<funcionarioRegistradoDP>> {
    try {
      const { data } = await http.get(`/funcionario?search=${search}`)
      return data
    } catch (error) {
      throw error
    }
  },
}
