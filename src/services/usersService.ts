import http from '../plugins/axios'
import type { Users } from '@/models/UsersModel'
import { useSnackbarStore } from '@/components/notifications/notificationsStore'

export async function getAllUsers(): Promise<Users[]> {
  try {
    const response = await http.get('/users')
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getUserById(id: number): Promise<Users> {
  try {
    const response = await http.get(`/users/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export async function createUser(newUser: Users): Promise<Users> {
  try {
    const response = await http.post('/users', newUser)
    await getAllUsers()
    useSnackbarStore().showSnackbar('User created successfully!', 'success')
    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while registering!', 'red')
    throw error
  }
}

export async function updateUser(user: Users): Promise<Users> {
  try {
    const response = await http.patch(`/users/${user.id}`, user)
    await getAllUsers()
    useSnackbarStore().showSnackbar('Record updated successfully!', 'success')
    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while updating the record!', 'red')
    throw error
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await http.delete(`/users/${id}`)
    await getAllUsers()
    useSnackbarStore().showSnackbar('Record deleted successfully!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while deleting the record!', 'red')
    throw error
  }
}

export function usersServices() {
  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }
}
