<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <div class="d-flex justify-space-between align-center">
                <div>
                    <v-icon>mdi-information-outline</v-icon>
                    {{ paginadorClass.search != undefined && paginadorClass.search != '' ? `Buscar por: ${paginadorClass.search}` : 'Consulte o funcionário' }}
                </div>

                <!-- Campo para consultar os registros pelo search -->
                <InputUpperCase v-model:="paginadorClass.search" :style="{
                    icon: 'mdi-magnify',
                    density: 'compact',
                    inputVariant: 'outlined',
                    btnVariant: 'text',
                    label: 'Buscar funcionário',
                    showPrepend: true,
                    maxWidth: 300,
                    hint: 'Nome do funcionário ou N° do registro',
                    btnDisabled: !paginadorClass.search
                }" @on-prepend-click="getRegistrosDP()" />
            </div>
        </template>

        <template #default>
            <v-divider />

            <!-- Loading -->
            <div class="d-flex justify-center" v-if="loading">
                <v-progress-circular color="primary" indeterminate />
            </div>

            <v-virtual-scroll :items="apiRegistrosDP" height="500" item-height="50">
                <template v-slot:default="{ item: registro }">
                    <v-list-item :title="`${registro.registroDP} - ${registro.nome}`"
                        :subtitle="`#Desc. setor: ${registro.descricaoSetor}`">

                        <template v-slot:prepend>
                            <v-icon>mdi-card-account-details-outline</v-icon>
                        </template>

                        <template v-slot:append>
                            <div class="pe-2">
                                <v-btn size="small" variant="elevated" color="info" icon="mdi-account-check-outline"
                                    @click="definirRegistroPorBusca(registro)" title="Selecionar">
                                </v-btn>
                            </div>
                        </template>
                    </v-list-item>
                </template>
            </v-virtual-scroll>

            <v-divider />
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Componentes
import BaseDialog from '../../BaseDialog.vue';
import InputUpperCase from '@/components/InputUpperCase.vue';

// Classes
import type { DialogRegistroDPClass } from './ClassDialogRegistroDP'
import { PaginatorClass } from '@/components/paginator/ClassPaginator'

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Models
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels';

// Services
import { firebirdServices } from '@/services/firebirdService';

// Vue
import { computed, onMounted, ref, watch } from 'vue'

const loading = ref(false) // Carregamento
const paginadorClass = ref(new PaginatorClass({
    limite: 10,
    offset: 1,
    totalPaginas: 0,
    totalRegistros: 0,
    orderBy: 'DESC',
    search: ''
})) // Classe para a paginação

const dialogRegistros = defineModel<DialogRegistroDPClass>('dialogRegistros', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: dialogRegistros.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        dialogRegistros.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'selecionado'): void
}>()

onMounted(async () => {
    await getRegistrosDP()
})

watch(() => dialogRegistros.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
});

function resetForm() {
    dialogRegistros.value.closeDialog()
    apiRegistrosDP.value = undefined
    paginadorClass.value.search = ''
}

// Consulta todos os motivos para alimentar o autocomplete
var apiRegistrosDP = ref<Array<funcionarioRegistradoDP>>()
async function getRegistrosDP() {
    try {
        loading.value = true
        const search = paginadorClass.value.search
        if (search) {
            const response = await firebirdServices.getRegistroDP(search)
            apiRegistrosDP.value = response
        }
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    } finally {
        loading.value = false
    }
}

function definirRegistroPorBusca(setRegistroDP: funcionarioRegistradoDP) {
    try {
        dialogRegistros.value.setValues(setRegistroDP)
        emit('selecionado')
        resetForm()
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
    }
}

</script>
