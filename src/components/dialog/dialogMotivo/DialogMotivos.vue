<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>{{ motivoModel.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline' }}</v-icon>
            {{ motivoModel.isEditing ? `Editar motivo: ${motivoModel.motivo.idMotivo}` : 'Criar novo motivo' }}
        </template>

        <template #default>
            <FormMotivo ref="formComponentRef" v-model:motivo="motivoModel.motivo"
                :is-editing="motivoModel.isEditing" :categorias="ApiCategorias?.registros || []"/>

            <v-row dense class="p-0 m-0">
                <v-col cols="12">
                    <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                        * indica campos obrigatórios
                    </small>
                </v-col>
            </v-row>
        </template>

        <template #acoes>
            <v-btn color="warning" variant="plain" @click="clearFields()">
                <v-icon class="pt-1">mdi-refresh</v-icon>
                {{ motivoModel.isEditing ? 'Desfazer' : 'Limpar' }}
            </v-btn>
            <v-spacer />

            <v-btn color="red" variant="plain" @click="resetForm()">
                <v-icon class="pt-1">mdi-close</v-icon>
                Fechar
            </v-btn>
            <v-btn color="success" variant="tonal" :disabled="!formComponentRef?.formIsValid" @click="submitForm()">
                <v-icon class="pt-1">mdi-content-save-check</v-icon>
                Salvar
            </v-btn>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Componentes
import FormMotivo from './FormMotivo.vue';
import BaseDialog from '../BaseDialog.vue';

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { DialogMotivosClass } from './ClassDialogMotivos'

// Models
import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Services
import { categoriasServices } from '@/services/categoriasServices';
import { motivosServices } from '@/services/motivosServices'

// Vue
import { computed, onBeforeMount, ref, watch } from 'vue'

const paginadorClass = ref(new PaginatorClass())
const ApiCategorias = ref<HeaderPaginatorModel<CategoriasMotivos>>()

const formComponentRef = ref<InstanceType<typeof FormMotivo> | null>(null);

const motivoModel = defineModel<DialogMotivosClass>('dialogMotivos', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: motivoModel.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        motivoModel.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'operacao-concluida'): void
}>()

// Alimentar os dados para as categorias
onBeforeMount(async () => {
    paginadorClass.value.autocomplete = true
    ApiCategorias.value = await categoriasServices.getCategorias(paginadorClass.value)
})

watch(() => motivoModel.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})

function clearFields() {
    motivoModel.value.clearFields()
}

function resetForm() {
    motivoModel.value.closeDialog()
}

async function cadastrarNovoMotivo() {
    try {
        await motivosServices.createMotivo(motivoModel.value.motivo);
        useSnackbarStore().showSnackbar('Motivo criado com sucesso!', 'success')
        emit('operacao-concluida')
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

async function updateMotivo() {
    try {
        await motivosServices.updateMotivo(motivoModel.value.motivo, motivoModel.value.motivo.idMotivo)
        useSnackbarStore().showSnackbar('Motivo modificado com sucesso!', 'success')
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

    motivoModel.value.isEditing ? await updateMotivo() : await cadastrarNovoMotivo()
}

</script>
