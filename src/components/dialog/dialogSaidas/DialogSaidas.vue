<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo v-if="visualizando">
            <v-icon>mdi-information-outline</v-icon>
            Visualizar informações da saída
        </template>

        <template #titulo v-else>
            <v-icon>{{ dialogSaidas.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline' }}</v-icon>
            {{ dialogSaidas.isEditing ? `Editar saída: ${dialogSaidas.saida.idSaida}` : 'Solicitar nova saída' }}
        </template>

        <template #default>
            <FormSaida ref="formComponentRef" v-model:saida="dialogSaidas.saida" :is-editing="dialogSaidas.isEditing" :visualizando="visualizando"/>

            <v-row dense class="p-0 m-0" v-if="!dialogSaidas.visualizando">
                <v-col cols="12">
                    <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                        * indica campos obrigatórios
                    </small>
                </v-col>
            </v-row>
        </template>

        <template #acoes v-if="visualizando">
            <v-btn color="info" variant="tonal" block @click="dialogSaidas.show = false">
                <v-icon class="pt-1">mdi-close</v-icon>
                Fechar informações
            </v-btn>
        </template>

        <template #acoes v-else>
            <v-btn color="warning" variant="plain" @click="clearFields()">
                <v-icon class="pt-1">mdi-refresh</v-icon>
                {{ dialogSaidas.isEditing ? 'Desfazer' : 'Limpar' }}
            </v-btn>

            <v-spacer />

            <v-btn color="red" variant="plain" @click="resetForm()">
                <v-icon class="pt-1">mdi-close</v-icon>
                Fechar
            </v-btn>
            <v-btn color="success" variant="tonal" :disabled="!formComponentRef?.formIsValid" @click="submitForm">
                <v-icon class="pt-1">mdi-content-save-check</v-icon>
                Salvar
            </v-btn>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Componentes
import BaseDialog from '../BaseDialog.vue';
import FormSaida from './FormSaida.vue';

// Classes
import { DialogSaidasClass } from './ClassDialogSaidas'

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Services
import { saidasServices } from '@/services/saidasServices'

// Vue
import { computed, ref, watch } from 'vue'

defineProps<{
    visualizando?: boolean | false
}>()

const formComponentRef = ref<InstanceType<typeof FormSaida> | null>(null);

const dialogSaidas = defineModel<DialogSaidasClass>('dialogSaidas', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: dialogSaidas.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        dialogSaidas.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'operacao-concluida'): void
}>()

watch(() => dialogSaidas.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
});

function clearFields() {
    dialogSaidas.value.clearFields()
}

function resetForm() {
    dialogSaidas.value.closeDialog()
}

async function cadastrarNovaSaida() {
    try {
        await saidasServices.novaSaida(dialogSaidas.value.saida);
        useSnackbarStore().showSnackbar('Saída solicitada com sucesso!', 'success')
        emit('operacao-concluida')
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

async function updateSaida() {
    try {
        await saidasServices.atualizarSaida(dialogSaidas.value.saida, dialogSaidas.value.saida.idSaida)
        useSnackbarStore().showSnackbar('Saída modificada com sucesso!', 'success')
        emit('operacao-concluida')
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

async function submitForm() {
    const isValid = await formComponentRef.value?.validate()
    if (!isValid) return

    dialogSaidas.value.isEditing ? await updateSaida() : await cadastrarNovaSaida()
}

</script>
