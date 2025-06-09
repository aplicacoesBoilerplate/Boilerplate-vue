<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-card prepend-icon="mdi-information-outline" title="Autorizações negadas para essa saída"
      subtitle="Verifique as observações antes de continuar">
      <v-divider />
      <v-virtual-scroll :items="autorizacoes?.registros" height="500" item-height="50">
        <template v-slot:default="{ item: autorizacao }">
          <v-list-item
            :title="`${autorizacao.idAutorizacao} - Aprovação: ${autorizacao.aprovacaoSaida ? 'Autorizado' : 'Negado'}`"
            :subtitle="`#Data da autorização: ${autorizacao.dataAutorizacao ? `${autorizacao.dataAutorizacao}` : 'Não definido'}`">
            <p>
              Negado por: {{ autorizacao.idFuncionarioAutorizacao }} - {{ autorizacao.nomeResponsavel }}
              <br>
              {{ autorizacao.observacaoAutorizacao }}
            </p>
          </v-list-item>
          <v-divider />
        </template>
      </v-virtual-scroll>
      <v-divider />

      <v-card-actions>
        <v-btn color="red" variant="plain" @click="eventoRejeicao(dialogAutorizacoesNegadas.idAutorizacaoOrigem)">
          <v-icon class="pt-1">mdi-close</v-icon>
          Rejeitar
        </v-btn>

        <v-spacer />
        <v-btn color="success" variant="tonal" @click="eventoLiberacao(dialogAutorizacoesNegadas.idAutorizacaoOrigem)">
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
import type { AutorizacoesConsulta } from "@/models/saidasModels/saidasModels";
import { autorizacoesServices } from "@/services/autorizacoesServices";

// Vue
import { computed } from 'vue'

interface Props {
  modelValue: DialogAutorizacoesNegadasClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogAutorizacoesNegadasClass): void,
  (e: 'emitir-rejeicao', autorizacao: AutorizacoesConsulta): void, // Se o modal for fechado com o botão de negar autorização
  (e: 'emitir-liberacao', autorizacao: AutorizacoesConsulta): void // Se o modal for fechado com o botão de confirmar autorização
}>()

const autorizacoes = computed(() => props.modelValue.autorizacoesNegadas)
const dialogAutorizacoesNegadas = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogAutorizacoesNegadas.value.show,
  set: (val) => dialogAutorizacoesNegadas.value.show = val
})

async function eventoRejeicao(idAutorizacao: number) {
  const response = await autorizacoesServices.getAutorizacaoById(idAutorizacao)
  emit('emitir-rejeicao', response)
  dialogAutorizacoesNegadas.value.closeDialog()
}

async function eventoLiberacao(idAutorizacao: number) {
  const response = await autorizacoesServices.getAutorizacaoById(idAutorizacao)
  emit('emitir-liberacao', response)
  dialogAutorizacoesNegadas.value.closeDialog()
}

</script>
