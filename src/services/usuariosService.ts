import http from './axios'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { useUtils } from './utilsServices'
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
import { usePaginator } from '@/components/paginator/paginatorStore'

async function getAllUsers(): Promise<HeaderPaginatorModel<UsuarioConsulta>> {
  try {
    const filtrosPaginator = usePaginator().filtrosPaginator
    const cleanedFilters = useUtils().removeUndefined(filtrosPaginator.value)
    const response = await http.get('/usuarios/consulta', {
      params: cleanedFilters,
    })

    usePaginator().carregarFiltrosDaAPI({
      limite: filtrosPaginator.value.limite,
      offset: filtrosPaginator.value.offset,
      totalPaginas: response.data.totalPaginas,
      totalRegistros: response.data.totalRegistros,
    })

    return response.data
  } catch (error) {
    throw error
  }
}

async function getUserById(id: number | string): Promise<UsuarioConsulta> {
  try {
    const filtrosPaginator = usePaginator().filtrosPaginator
    const response = await http.get(`/usuarios/${id}`)
    useSnackbarStore().showSnackbar(`User ${id} found successfully!`, 'success')

    usePaginator().carregarFiltrosDaAPI({
      limite: filtrosPaginator.value.limite,
      offset: filtrosPaginator.value.offset,
      totalPaginas: response.data.totalPaginas,
      totalRegistros: response.data.totalRegistros,
    })

    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('User not found!', 'red')
    throw error
  }
}

async function getUserByIdSemSnackBarSuccess(id: number | string): Promise<UsuarioConsulta> {
  try {
    const response = await http.get(`/users/${id}`)
    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('User not found!', 'red')
    throw error
  }
}

async function createUser(newUser: UsuarioConsulta): Promise<UsuarioConsulta> {
  try {
    const response = await http.post('/usuarios', newUser)
    await getAllUsers()
    useSnackbarStore().showSnackbar('User created successfully!', 'success')
    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while registering!', 'red')
    throw error
  }
}

async function solicitarAcesso(newUser: UsuarioConsulta): Promise<UsuarioConsulta> {
  try {
    const response = await http.post('/usuarios/registrar', newUser)
    return response.data
  } catch (error) {
    throw error
  }
}

async function updateUser(user: UsuarioConsulta): Promise<UsuarioConsulta> {
  await getUserById(user.idUsuario!)
  try {
    const response = await http.put(`/usuarios/${user.idUsuario}`, user)
    await getAllUsers()
    useSnackbarStore().showSnackbar('Record updated successfully!', 'success')
    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while updating the record!', 'red')
    throw error
  }
}

async function deleteUser(id: number): Promise<void> {
  await getUserById(id)
  try {
    await http.delete(`/usuarios/${id}`)
    await getAllUsers()
    useSnackbarStore().showSnackbar('Record deleted successfully!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while deleting the record!', 'red')
    throw error
  }
}

export function usuariosServices() {
  return {
    getAllUsers,
    getUserById,
    getUserByIdSemSnackBarSuccess,
    createUser,
    solicitarAcesso,
    updateUser,
    deleteUser,
  }
}
