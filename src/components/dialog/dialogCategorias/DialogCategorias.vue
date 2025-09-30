<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>{{ dialogCategorias.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline' }}</v-icon>
            {{ dialogCategorias.isEditing ? `Editar categoria: ${dialogCategorias.categoria.idCategoria}` : 'Criar nova categoria'}}
        </template>

        <template #default>
            <FormCategoria ref="formComponentRef" v-model:categoria="dialogCategorias.categoria"
                :is-editing="dialogCategorias.isEditing" />

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
                {{ dialogCategorias.isEditing ? 'Desfazer' : 'Limpar' }}
            </v-btn>

            <v-spacer />

            <v-btn color="red" variant="plain" @click="resetForm">
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
import FormCategoria from './FormCategoria.vue';
import BaseDialog from '@/components/dialog/BaseDialog.vue';

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { DialogCategoriasClass } from './ClassDialogCategorias'

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Services
import { categoriasServices } from '@/services/categoriasServices';

// Vue
import { computed, onMounted, ref, watch } from 'vue'

const paginadorClass = ref(new PaginatorClass())
const ApiCategorias = ref()

const formComponentRef = ref<InstanceType<typeof FormCategoria> | null>(null);

const dialogCategorias = defineModel<DialogCategoriasClass>('dialogCategorias', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: dialogCategorias.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        dialogCategorias.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'operacao-concluida'): void
}>()

onMounted(async () => {
    paginadorClass.value.autocomplete = true
    ApiCategorias.value = await categoriasServices.getCategorias(paginadorClass.value)
})

watch(() => dialogCategorias.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})

function clearFields() {
    dialogCategorias.value.clearFields()
}

function resetForm() {
    dialogCategorias.value.closeDialog()
}

async function cadastrarNovaCategoria() {
    try {
        await categoriasServices.createCategoria(dialogCategorias.value.categoria);
        useSnackbarStore().showSnackbar('Categoria criada com sucesso!', 'success')
        emit('operacao-concluida')
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

async function updateCategoria() {
    try {
        await categoriasServices.updateCategoria(dialogCategorias.value.categoria)
        useSnackbarStore().showSnackbar('Categoria modificada com sucesso!', 'success')
        emit('operacao-concluida')
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

async function submitForm() {
    const { valid } = await formComponentRef.value?.validate()
    if (!valid) return

    dialogCategorias.value.isEditing ? await updateCategoria() : await cadastrarNovaCategoria()
}

</script>
