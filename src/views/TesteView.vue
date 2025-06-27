<script setup lang="ts">
import { DialogRegistroDPClass } from '@/components/dialog/dialogSaidas/dialogRegistroDP/ClassDialogRegistroDP';
import DialogRegistroDP from '@/components/dialog/dialogSaidas/dialogRegistroDP/DialogRegistroDP.vue';
import { ref } from 'vue';

const dialogRegistros = ref(new DialogRegistroDPClass())
const telefone = ref('')

function clonarObjetoDialogRegistrosDP(val: DialogRegistroDPClass) {
  Object.assign(dialogRegistros, val)
}
</script>

<template>
  <DialogRegistroDP :model-value="dialogRegistros"
    @update:modelValue="clonarObjetoDialogRegistrosDP(dialogRegistros)" />

  <v-text-field v-model="telefone" v-telefone-mask label="Telefone" placeholder="(00) 00000-0000" variant="outlined"
    clearable />

</template>
