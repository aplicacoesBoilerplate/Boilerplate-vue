<template>
  <v-dialog
    v-model="isDialogVisible"
    :max-width="dialog.maxWidth || 400"
    :max-height="dialog.maxHeight || 800"
    :persistent="dialog.persistente" || false
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h6">
          <slot name="titulo">TÍTULO</slot>
        </div>

        <v-icon-btn
          icon="mdi-close"
          v-tooltip="'Fechar'"
          color="red-lighten-1"
          variant="plain"
          @click="toggleDialog()"
        />
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions class="sticky-actions">
        <slot name="acoes" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { IModelBaseDialog } from '@/classes/models/modelComponents/ModelDialogBase'
import { computed } from 'vue'

const dialog = defineModel<IModelBaseDialog>('atributos', { required: true })

const isDialogVisible = computed({
  get() {
    return dialog.value.visualizar
  },
  set(newValue: boolean) {
    dialog.value = { ...dialog.value, visualizar: newValue }
  },
})

function toggleDialog() {
  dialog.value = { ...dialog.value, visualizar: !dialog.value.visualizar }
}

</script>
