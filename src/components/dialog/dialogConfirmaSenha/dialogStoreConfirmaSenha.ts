import { todoServices } from '@/services/todoService'
import { usersServices } from '@/services/usersService'
import { useSnackbarStore } from '@/components/notifications/notificationsStore'
import { ref } from 'vue'

const showDialogDialogConfirmarSenha = ref(false)
const identificarOperacaoDelete = ref({
  escopoCrud: '',
  idRegistro: 0,
})

function openDialogConfirmarSenha() {
  showDialogDialogConfirmarSenha.value = true
}

function closeDialogConfirmarSenha() {
  showDialogDialogConfirmarSenha.value = false
}

async function deleteTask(idTask: number) {
  await todoServices().deleteTask(idTask)
  closeDialogConfirmarSenha()
}

async function deleteUser(idUser: number) {
  await usersServices().deleteUser(idUser)
  closeDialogConfirmarSenha()
}

async function setarIdentificacaoOperacaoDelete(type: string, idRegister: number) {
  identificarOperacaoDelete.value.escopoCrud = type
  identificarOperacaoDelete.value.idRegistro = idRegister
}

async function identificarDelete() {
  console.log('Escopo: ', identificarOperacaoDelete.value.escopoCrud)
  console.log('idRegistro: ', identificarOperacaoDelete.value.idRegistro)
  switch (identificarOperacaoDelete.value.escopoCrud) {
    case 'user':
      await deleteUser(identificarOperacaoDelete.value.idRegistro)
      await usersServices().getAllUsers()
    case 'task':
      await deleteTask(identificarOperacaoDelete.value.idRegistro)
      await todoServices().getAllTasks()
    default:
      useSnackbarStore().showSnackbar(
        'Unidentified resource! Unable to recognize object for removal',
        'red',
      )
  }
}

export function useDialogStoreConfirmarSenha() {
  return {
    showDialogDialogConfirmarSenha,
    openDialogConfirmarSenha,
    closeDialogConfirmarSenha,
    identificarDelete,
    setarIdentificacaoOperacaoDelete,
  }
}
