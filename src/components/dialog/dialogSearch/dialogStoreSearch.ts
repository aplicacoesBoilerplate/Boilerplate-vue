import { ref } from 'vue'

const showDialogSearch = ref(false)

function openSearchDialog() {
  showDialogSearch.value = true
}

function closeSearchDialog() {
  showDialogSearch.value = false
}

export function useDialogStoreSearch() {
  return {
    showDialogSearch,
    openSearchDialog,
    closeSearchDialog,
  }
}
