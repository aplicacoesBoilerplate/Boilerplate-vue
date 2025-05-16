import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStoreConfirmarSenha = defineStore('confirmar', () => {
  const showDialogDialogConfirmarSenha = ref(false)

  function openDialogConfirmarSenha() {
    showDialogDialogConfirmarSenha.value = true
  }

  function closeDialogConfirmarSenha() {
    showDialogDialogConfirmarSenha.value = false
  }

  const callbackPosSenha = ref<null | (() => Promise<void>)>(null)

  function setCallbackPosSenha(callback: () => Promise<void>) {
    callbackPosSenha.value = callback
  }

  return {
    showDialogDialogConfirmarSenha,
    openDialogConfirmarSenha,
    closeDialogConfirmarSenha,
    callbackPosSenha,
    setCallbackPosSenha,
  }
})
