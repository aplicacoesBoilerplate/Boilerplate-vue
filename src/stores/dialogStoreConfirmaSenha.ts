import { todoServices } from '@/services/todoService'
import { usersServices } from '@/services/usersService'
import { useSnackbarStore } from '@/stores/SnackbarStore'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useDialogStoreUsers } from '@/components/dialog/dialogUser/dialogStoreUsers'
import { useDialogStoreTask } from '@/components/dialog/dialogTask/dialogStoreTask'

export const useDialogStoreConfirmarSenha = defineStore('confirmar', () => {
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

  function setarIdentificacaoOperacaoDelete(type: string, idRegister: number) {
    identificarOperacaoDelete.value.escopoCrud = type
    identificarOperacaoDelete.value.idRegistro = idRegister
  }

  async function identificarDelete() {
    console.log('Escopo: ', identificarOperacaoDelete.value.escopoCrud)
    switch (identificarOperacaoDelete.value.escopoCrud) {
      case 'user':
        await deleteUser(identificarOperacaoDelete.value.idRegistro)
        useDialogStoreUsers().apiUsers.value = await usersServices().getAllUsers()
        break
      case 'task':
        await deleteTask(identificarOperacaoDelete.value.idRegistro)
        useDialogStoreTask().apiTasks.value = await todoServices().getAllTasks()
        break
      default:
        useSnackbarStore().showSnackbar(
          'Unidentified resource! Unable to recognize object for removal',
          'red',
        )
        break
    }
  }

  return {
    showDialogDialogConfirmarSenha,
    openDialogConfirmarSenha,
    closeDialogConfirmarSenha,
    identificarDelete,
    setarIdentificacaoOperacaoDelete,
  }
})
