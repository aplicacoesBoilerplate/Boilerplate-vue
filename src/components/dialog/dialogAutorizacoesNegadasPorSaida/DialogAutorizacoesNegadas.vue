<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>mdi-information-outline</v-icon>
            <h4>Autorizações negadas para essa saída</h4>
            <h5>Verifique as observações antes de continuar</h5>
        </template>

        <template #default>
            <v-virtual-scroll :items="negadas.autorizacoesNegadas?.registros" height="500" item-height="50">
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
        </template>

        <template #acoes>
            <v-btn color="red" variant="plain" @click="eventoRejeicao(negadas.idAutorizacaoOrigem)">
                <v-icon class="pt-1">mdi-close</v-icon>
                Negar
            </v-btn>

            <v-spacer />

            <v-btn color="success" variant="tonal" @click="eventoLiberacao(negadas.idAutorizacaoOrigem)">
                <v-icon class="pt-1">mdi-check</v-icon>
                Liberar
            </v-btn>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Components
import BaseDialog from "../BaseDialog.vue";

// Classes
import { DialogAutorizacoesNegadasClass } from "@/components/dialog/dialogAutorizacoesNegadasPorSaida/ClassDialogAutorizacoesNegadas.ts";

// Models
import type { AutorizacoesConsulta } from "@/models/saidasModels/saidasModels";

// Service
import { autorizacoesServices } from "@/services/autorizacoesServices";

// Vue
import { computed } from "vue";

const negadas = defineModel<DialogAutorizacoesNegadasClass>('negadas', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: negadas.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        negadas.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'emitir-rejeicao', autorizacao: AutorizacoesConsulta): void, // Se o modal for fechado com o botão de negar autorização
    (e: 'emitir-liberacao', autorizacao: AutorizacoesConsulta): void // Se o modal for fechado com o botão de confirmar autorização
}>()

async function eventoRejeicao(idAutorizacao: number) {
    const response = await autorizacoesServices.getAutorizacaoById(idAutorizacao)
    emit('emitir-rejeicao', response)
    negadas.value.closeDialog()
}

async function eventoLiberacao(idAutorizacao: number) {
    const response = await autorizacoesServices.getAutorizacaoById(idAutorizacao)
    emit('emitir-liberacao', response)
    negadas.value.closeDialog()
}

</script>
