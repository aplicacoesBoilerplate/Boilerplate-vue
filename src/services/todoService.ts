import http from '../plugins/axios'
// Modelo padrão
import type { Task } from '@/models/TaskModel'
import { usersServices } from './usersService'

export async function getAllTasks(): Promise<Task[]> {
  try {
    const response = await http.get('/todos')
    const tasks = response.data

    const enriquecimentoComResponsavel = await Promise.all(
      tasks.map(async (task: Task) => {
        try {
          const user = await usersServices().getUserById(task.idEmployee)
          return {
            ...task,
            employeeName: user.username,
          }
        } catch (error) {
          return {
            ...task,
            employeeName: 'Usuário não encontrado',
          }
        }
      }),
    )

    return enriquecimentoComResponsavel
  } catch (error) {
    throw error
  }
}

export async function getTaskById(id: number): Promise<Task> {
  try {
    const response = await http.get(`/todos/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getLastId(): Promise<number> {
  const response = await http.get('/todos?_sort=id&_order=desc&_limit=1')
  const lastTask = response.data[0]
  const lastId = lastTask.id
  return lastId + 1
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  try {
    const response = await http.post('/todos', task)
    await getAllTasks()
    return response.data
  } catch (error) {
    throw error
  }
}

export async function updateTask(task: Task): Promise<Task> {
  if (task.dateDelivery != null && task.dateDelivery != '') task.status = 'Completed'
  try {
    const response = await http.patch(`/todos/${task.id}`, task)
    await getAllTasks()
    return response.data
  } catch (error) {
    throw error
  }
}

export async function deleteTask(id: number): Promise<void> {
  await http.delete(`/todos/${id}`)
  await getAllTasks()
}

export function todoServices() {
  return {
    getAllTasks,
    getTaskById,
    getLastId,
    createTask,
    updateTask,
    deleteTask,
  }
}
