import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStoreSearch = defineStore('buscar', () => {
  const showDialogSearch = ref(false)

  function openSearchDialog() {
    showDialogSearch.value = true
  }

  function closeSearchDialog() {
    showDialogSearch.value = false
  }

  function search(search: string) {}

  return {
    showDialogSearch,
    openSearchDialog,
    closeSearchDialog,
    search,
  }
})
