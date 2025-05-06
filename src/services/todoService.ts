import http from '../plugins/axios'
// Modelo padrão
import type { Task } from '@/models/TaskModel'

export async function getAllTasks(): Promise<Task[]> {
  try {
    const response = await http.get('/todos')
    return response.data
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

export async function createTask(task: Task): Promise<Task> {
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
    return response.data
  } catch (error) {
    throw error
  }
}

export async function deleteTask(id: number): Promise<void> {
  await http.delete(`/todos/${id}`)
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
