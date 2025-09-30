<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>{{ dialogAutorizacoes.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline' }}</v-icon>
            {{ dialogAutorizacoes.isEditing ? `Editar autorização: ${dialogAutorizacoes.autorizacao.idAutorizacao}` : 'Criar nova autorização' }}
        </template>

        <template #default>
            <FormAutorizacao ref="formComponentRef" v-model:autorizacao="dialogAutorizacoes.autorizacao" />

            <v-row dense class="p-0 m-0">
                <v-col cols="12">
                    <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                        * indica campos obrigatórios
                    </small>
                </v-col>
            </v-row>
        </template>

        <template #acoes>
            <v-btn color="warning" variant="plain" @click="clearFields">
                <v-icon class="pt-1">mdi-refresh</v-icon>
                {{ dialogAutorizacoes.isEditing ? 'Desfazer' : 'Limpar' }}
            </v-btn>
            <v-spacer />

            <v-btn color="red" variant="plain" @click="resetForm">
                <v-icon class="pt-1">mdi-close</v-icon>
                Fechar
            </v-btn>
            <v-btn color="success" variant="tonal" :disabled="!formComponentRef?.formIsValid" @click="atualizarAutorizacaoSaida">
                <v-icon class="pt-1">mdi-content-save-check</v-icon>
                Salvar
            </v-btn>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Componentes
import BaseDialog from '../BaseDialog.vue';
import FormAutorizacao from './FormAutorizacao.vue';

// Classes
import { DialogAutorizacoesClass } from './ClassDialogAutorizacoes'

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Services
import { autorizacoesServices } from '@/services/autorizacoesServices'

// Vue
import { computed, ref, watch } from 'vue'

const formComponentRef = ref<InstanceType<typeof FormAutorizacao> | null>(null);

const dialogAutorizacoes = defineModel<DialogAutorizacoesClass>('dialogAutorizacoes', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: dialogAutorizacoes.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        dialogAutorizacoes.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'atualizar-autorizacoes'): void
}>()

watch(() => dialogAutorizacoes.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
});

function clearFields() {
    dialogAutorizacoes.value.clearFields()
}

function resetForm() {
    dialogAutorizacoes.value.closeDialog()
}

// Como não é um dialog com edição de informação, o submite é o único método diretamente
async function atualizarAutorizacaoSaida() {
    try {
        const atualizarAutorizacao = { ...dialogAutorizacoes.value.autorizacao }
        await autorizacoesServices.atualizarAutorizacao(atualizarAutorizacao, atualizarAutorizacao.idAutorizacao);
        emit('atualizar-autorizacoes')
        resetForm();
        useSnackbarStore().showSnackbar(`
            Autorização ${atualizarAutorizacao.idAutorizacao}
            ${atualizarAutorizacao.aprovacaoSaida ? 'concedida' : 'negada'}
            para a saída ${atualizarAutorizacao.idSaida}`, 'success'
        )
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

</script>
