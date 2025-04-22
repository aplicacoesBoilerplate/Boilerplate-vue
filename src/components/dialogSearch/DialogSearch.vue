<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card title="What are you looking for?">
      <v-card-text>
        <v-text-field hint="Ex: task status, accountable" v-model="search" label="Search..."
          prepend-inner-icon="mdi-magnify" clearable />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Close" color="red" variant="outlined" @click="dialogStore.closeSearchDialog()" />
        <v-btn text="Confirm" color="teal-darken-1" variant="outlined" @click="buscar()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDialogStore } from './dialogStore'

const dialogStore = useDialogStore()

const dialog = computed({
  get: () => dialogStore.showDialogSearch.value,
  set: (val: boolean) => dialogStore.showDialogSearch.value = val
})

let search = ref('')

function buscar() {
  console.log('Valor buscado:', search.value)
  dialogStore.closeSearchDialog()
  search = ref('');
}

</script>
