import http from '../plugins/axios'
import type { Task } from '@/models/TaskModel'
import { usersServices } from './usersService'
import { useSnackbarStore } from '@/components/notifications/notificationsStore'

async function getAllTasks(): Promise<Task[]> {
  try {
    const response = await http.get('/todos')
    const tasks = response.data
    const enriquecimentoComResponsavel = await Promise.all(
      tasks.map(async (task: Task) => {
        try {
          const user = await usersServices().getUserByIdSemSnackBarSuccess(task.idEmployee)
          return {
            ...task,
            employeeName: user.username,
          }
        } catch (error) {
          return {
            ...task,
            employeeName: 'User not found',
          }
        }
      }),
    )
    return enriquecimentoComResponsavel
  } catch (error) {
    useSnackbarStore().showSnackbar(`Error querying data! ${error}`, 'red')
    throw error
  }
}

async function getTaskById(id: number | string): Promise<Task> {
  try {
    const response = await http.get(`/todos/${id}`)
    useSnackbarStore().showSnackbar(`Task ${id} found successfully!`, 'success')
    return response.data
  } catch (error) {
    useSnackbarStore().showSnackbar('Task not found!', 'red')
    throw error
  }
}

async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  try {
    const user = await usersServices().getUserById(task.idEmployee)
    task.employeeName = user.username
    try {
      const response = await http.post('/todos', task)
      await getAllTasks()
      useSnackbarStore().showSnackbar('Record created successfully!', 'success')
      return response.data
    } catch (error) {
      useSnackbarStore().showSnackbar('An error occurred while registering!', 'red')
      throw error
    }
  } catch (error) {
    useSnackbarStore().showSnackbar('Responsible employee not found!', 'red')
    throw error
  }
}

async function updateTask(task: Task): Promise<Task> {
  await getTaskById(task.id!)
  if (task.dateDelivery != null && task.dateDelivery != '') task.status = 'Completed'
  try {
    const user = await usersServices().getUserById(task.idEmployee)
    task.employeeName = user.username
    try {
      const response = await http.patch(`/todos/${task.id}`, task)
      await getAllTasks()
      useSnackbarStore().showSnackbar('Record updated successfully!', 'success')
      return response.data
    } catch (error) {
      useSnackbarStore().showSnackbar('An error occurred while updating the record!', 'red')
      throw error
    }
  } catch (error) {
    useSnackbarStore().showSnackbar('Responsible employee not found!', 'red')
    throw error
  }
}

async function deleteTask(id: number): Promise<void> {
  await getTaskById(id)
  try {
    await http.delete(`/todos/${id}`)
    await getAllTasks()
    useSnackbarStore().showSnackbar('Record deleted successfully!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar('An error occurred while deleting the record!', 'red')
    throw error
  }
}

export function todoServices() {
  return {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
  }
}
