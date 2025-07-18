// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type {Dashboard, Relatorios} from '@/models/relatoriosModels/relatoriosModels'
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

  // Consulta dos modelos de raltórios disponíveis
  async getModelos(paginador: PaginatorClass): Promise<Relatorios[]> {
    try {
      const { data } = await http.get('/relatorios/disponiveis', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Consulta dos campos da tabela
  async getTabelasRelacionadas(modeloRelatorio: string): Promise<string[]> {
    try {
      const { data } = await http.get('/relatorios/tabelasRelacionadas', {
        params: { modeloRelatorio },
      })
      return data
    } catch (error) {
      throw error
    }
  },

  // Consulta dos campos da tabela
  async getCamposTabela(tabela: string, campo?: string): Promise<string[]> {
    try {
      const { data } = await http.get('/relatorios/camposTabela', {
        params: { tabela, campo },
      })
      return data
    } catch (error) {
      throw error
    }
  },
}
