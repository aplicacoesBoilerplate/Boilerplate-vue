import type { TaskDialog } from '@/models/TaskModel'
import { ref } from 'vue'

const showDialogNewTask = ref(false)
const taskToEdit = ref<TaskDialog | null>(null)

function openNewTaskDialog() {
  showDialogNewTask.value = true
}

function startCreatingNewTask() {
  taskToEdit.value = null
  openNewTaskDialog()
}

function closeNewTaskDialog() {
  showDialogNewTask.value = false
  taskToEdit.value = null
}

function editTaskDialog(task: TaskDialog) {
  taskToEdit.value = { ...task }
  openNewTaskDialog()
}

export function useDialogStoreNewTask() {
  return {
    showDialogNewTask,
    openNewTaskDialog,
    startCreatingNewTask,
    closeNewTaskDialog,
    editTaskDialog,
    taskToEdit,
  }
}
