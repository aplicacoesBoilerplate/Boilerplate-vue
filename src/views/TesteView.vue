<script setup lang="ts">
import { DialogRegistroDPClass } from '@/components/dialog/dialogSaidas/dialogRegistroDP/ClassDialogRegistroDP';
import DialogRegistroDP from '@/components/dialog/dialogSaidas/dialogRegistroDP/DialogRegistroDP.vue';
import { ref } from 'vue';

const dialogRegistros = ref(new DialogRegistroDPClass())

function clonarObjetoDialogRegistrosDP(val: DialogRegistroDPClass) {
  Object.assign(dialogRegistros, val)
}
</script>

<template>
  <DialogRegistroDP :model-value="dialogRegistros" @update:modelValue="clonarObjetoDialogRegistrosDP(dialogRegistros)" />
</template>
