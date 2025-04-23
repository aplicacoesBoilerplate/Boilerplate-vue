<template>
  <v-dialog v-model="dialogSearch" max-width="500">
    <v-card title="What are you looking for?">
      <v-card-text>
        <v-text-field hint="Ex: task status, accountable" v-model="search" label="Search..."
          prepend-inner-icon="mdi-magnify" clearable />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Close" color="red" variant="outlined" @click="dialogStoreSearch.closeSearchDialog()" />
        <v-btn text="Confirm" color="teal-darken-1" variant="outlined" @click="buscar()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDialogStoreSearch } from './dialogStoreSearch'

const dialogStoreSearch = useDialogStoreSearch()

const dialogSearch = computed({
  get: () => dialogStoreSearch.showDialogSearch.value,
  set: (val: boolean) => dialogStoreSearch.showDialogSearch.value = val
})

let search = ref('')

function buscar() {
  const valorBuscado = search.value
  dialogStoreSearch.closeSearchDialog()
  search = ref('');
}

</script>
