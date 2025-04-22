import { ref } from 'vue'

const showDialogSearch = ref(false)

function openSearchDialog() {
  showDialogSearch.value = true
}

function closeSearchDialog() {
  showDialogSearch.value = false
}

export function useDialogStore() {
  return {
    showDialogSearch,
    openSearchDialog,
    closeSearchDialog,
  }
}
