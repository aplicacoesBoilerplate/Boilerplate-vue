import { ref } from 'vue'

const showDialogNewTask = ref(false)

function openNewTaskDialog() {
  showDialogNewTask.value = true
}

function closeNewTaskDialog() {
  showDialogNewTask.value = false
}

// function createEmptyTask() {
//   return {
//     title: '',
//     description: '',
//     idEmployee: 0,
//     estimatedDelivery: null,
//   }
// }

// function editTaskDialog(task: {
//   title: string
//   description: string
//   idEmployee: number
//   estimatedDelivery: Date
// }) {
//   return {
//     title: task.title,
//     description: task.description,
//     idEmployee: task.idEmployee,
//     estimatedDelivery: task.estimatedDelivery,
//   }
// }

export function useDialogStoreNewTask() {
  return {
    showDialogNewTask,
    openNewTaskDialog,
    closeNewTaskDialog,
  }
}
