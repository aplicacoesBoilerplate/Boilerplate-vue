// Classes
import type { PaginatorClass } from '@/components/paginator/ClassPaginator'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels'
// Services
import http from './axios'

export const categoriasServices = {

  async getCategorias(paginador: PaginatorClass): Promise<HeaderPaginatorModel<CategoriasMotivos>> {
    try {
      const { data } = await http.get('/categorias/consulta', {
        params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  async getCategoriaById(idCategoria: number): Promise<CategoriasMotivos> {
    try {
      const { data } = await http.get(`/categorias/${idCategoria}`)
      return data
    } catch (error) {
      throw error
    }
  },

  async createCategoria(novaCategoria: CategoriasMotivos): Promise<CategoriasMotivos> {
    try {
      const { data } = await http.post('/categorias', novaCategoria)
      return data
    } catch (error) {
      throw error
    }
  },

  async updateMotivo(
    categoriaAtualizada: CategoriasMotivos
  ): Promise<CategoriasMotivos> {
    try {
      const { data } = await http.put('/categorias', categoriaAtualizada)
      return data
    } catch (error) {
      throw error
    }
  },

  async deleteMotivo(idCategoria: number): Promise<CategoriasMotivos> {
    try {
      const { data } = await http.delete(`/categorias/${idCategoria}`)
      return data
    } catch (error) {
      throw error
    }
  },
}
