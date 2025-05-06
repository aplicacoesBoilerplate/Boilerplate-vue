import type { Task } from '@/models/TaskModel'
import { todoServices } from '@/services/todoService'
import { ref } from 'vue'

const showDialogTask = ref(false)
const taskToEdit = ref<Task | null>(null)
const todoService = todoServices()
const emptyTask: Task = {
  title: '',
  description: '',
  idEmployee: 0,
  estimatedDelivery: '',
  dateDelivery: '',
  status: 'Pending',
}

var apiTasks = ref<Task[]>([])

function openTaskDialog() {
  showDialogTask.value = true
}

function startCreatingNewTask() {
  taskToEdit.value = null
  openTaskDialog()
}

function closeTaskDialog() {
  showDialogTask.value = false
  taskToEdit.value = null
}

async function createNewTask(newTask: Task) {
  await todoService.createTask(newTask)
  apiTasks.value = await todoService.getAllTasks()
  closeTaskDialog()
}

async function updateTask(taskToEdit: Task) {
  await todoService.updateTask(taskToEdit)
  apiTasks.value = await todoService.getAllTasks()
  closeTaskDialog()
}

async function deleteTask(id: number) {
  await todoService.deleteTask(id)
  closeTaskDialog()
}

function completeFormEditTaskDialog(task: Task) {
  taskToEdit.value = { ...task }
  showDialogTask.value = true
}

export function useDialogStoreTask() {
  return {
    showDialogTask,
    openTaskDialog,
    startCreatingNewTask,
    closeTaskDialog,
    completeFormEditTaskDialog,
    taskToEdit,
    createNewTask,
    updateTask,
    deleteTask,
    emptyTask,
    apiTasks,
  }
}
