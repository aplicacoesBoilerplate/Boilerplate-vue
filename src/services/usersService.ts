import http from '../plugins/axios'
import type { Users } from '@/models/UsersModel'

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
    return response.data
  } catch (error) {
    throw error
  }
}

export async function updateUser(user: Users): Promise<Users> {
  try {
    const response = await http.patch(`/users/${user.id}`, user)
    await getAllUsers()
    return response.data
  } catch (error) {
    throw error
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await http.delete(`/users/${id}`)
    await getAllUsers()
  } catch (error) {
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
