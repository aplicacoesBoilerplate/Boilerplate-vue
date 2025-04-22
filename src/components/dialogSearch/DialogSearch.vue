<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card title="Search">
      <v-card-text>
        <v-text-field hint="Ex: status da tarefa, responsável" v-model="search" label="Buscar..."
          prepend-inner-icon="mdi-magnify" clearable />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Fechar" color="red" variant="outlined" @click="dialogStore.closeSearchDialog()" />
        <v-btn text="Buscar" color="teal-darken-1" variant="outlined" @click="buscar()" />
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
