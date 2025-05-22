import type { Task } from '@/models/TaskModel'
import { todoServices } from '@/services/todoService'
import { usuariosServices } from '@/services/usuariosService'
import { ref } from 'vue'

const showDialogTask = ref(false)
const taskToEdit = ref<Task | null>(null)
const todoService = todoServices()
const employeeName = ref<string | null>('')
const emptyTask: Task = {
  title: '',
  description: '',
  idEmployee: 0,
  employeeName: '',
  estimatedDelivery: '',
  dateDelivery: '',
  status: 'Pending',
}

var apiTasks = ref<Task[]>([])
var isEditing = ref<Boolean>()

function openTaskDialog() {
  showDialogTask.value = true
  isEditing.value = false
}

function startCreatingNewTask() {
  taskToEdit.value = null
  isEditing.value = false
  openTaskDialog()
}

function closeTaskDialog() {
  showDialogTask.value = false
  taskToEdit.value = null
  isEditing.value = false
  employeeName.value = null
}

async function createNewTask(newTask: Task) {
  isEditing.value = false
  await todoService.createTask(newTask)
  apiTasks.value = await todoService.getAllTasks()
  closeTaskDialog()
}

async function updateTask(taskToEdit: Task) {
  isEditing.value = true
  await todoService.updateTask(taskToEdit)
  apiTasks.value = await todoService.getAllTasks()
  closeTaskDialog()
}

async function deleteTask(id: number) {
  await todoService.deleteTask(id)
  closeTaskDialog()
}

function completeFormEditTaskDialog(task: Task) {
  isEditing.value = true
  taskToEdit.value = { ...task }
  showDialogTask.value = true
  getEmployeeName(task)
}

async function getEmployeeName(task: Task) {
  if (!task.idEmployee) {
    employeeName.value = ''
    return
  }
  try {
    const user = await usuariosServices.getUserById(task.idEmployee)
    employeeName.value = user.nome
  } catch (error) {
    employeeName.value = 'User not found'
  }
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
    employeeName,
    getEmployeeName,
    isEditing,
  }
}
