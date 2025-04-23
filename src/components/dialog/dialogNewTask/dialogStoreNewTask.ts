import { ref } from 'vue'

const showDialogNewTask = ref(false)

function openNewTaskDialog() {
  showDialogNewTask.value = true
}

function closeNewTaskDialog() {
  showDialogNewTask.value = false
}

export function useDialogStoreNewTask() {
  return {
    showDialogNewTask,
    openNewTaskDialog,
    closeNewTaskDialog,
  }
}
