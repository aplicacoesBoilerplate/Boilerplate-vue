<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-card prepend-icon="mdi-information-outline"
            title="Autorizações negadas para essa saída"
            subtitle="Verifique as observações antes de continuar"
    >
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            {{ autorizacoes }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider/>

      <v-card-actions>
        <v-btn color="red" variant="plain" @click="eventoRejeicao()">
          <v-icon class="pt-1">mdi-close</v-icon>
          Rejeitar
        </v-btn>

        <v-spacer/>
        <v-btn color="success" variant="tonal" @click="eventoLiberacao()">
          <v-icon class="pt-1">mdi-check</v-icon>
          Liberar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Classes
import type { DialogAutorizacoesNegadasClass } from "@/components/dialog/dialogAutorizacoesNegadasPorSaida/ClassDialogAutorizacoesNegadas.ts";

// Vue
import {computed} from 'vue'

interface Props {
  modelValue: DialogAutorizacoesNegadasClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogAutorizacoesNegadasClass): void,
  (e: 'emitir-rejeicao'): void, // Se o modal for fechado com o botão de negar autorização
  (e: 'emitir-liberacao'): void // Se o modal for fechado com o botão de confirmar autorização
}>()

const autorizacoes = computed(() => props.modelValue.autorizacoesNegadas)
const dialogAutorizacoesNegadas = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogAutorizacoesNegadas.value.show,
  set: (val) => dialogAutorizacoesNegadas.value.show = val
})

function eventoRejeicao() {
  emit('emitir-rejeicao')
  dialogAutorizacoesNegadas.value.closeDialog()
}

function eventoLiberacao() {
  emit('emitir-liberacao')
  dialogAutorizacoesNegadas.value.closeDialog()
}

</script>
