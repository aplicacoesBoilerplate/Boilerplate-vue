<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>mdi-information-variant-circle-outline</v-icon>
            Informações da versão atual
        </template>

        <template #default>
            <v-list dense>
                <v-list-item>
                    <template v-slot:prepend>
                        <v-list-item-icon>
                            <v-icon size="x-large" color="info" class="mr-3">mdi-code-block-tags</v-icon>
                        </v-list-item-icon>
                    </template>
                    <v-list-item-content>
                        <v-list-item-title>Versão Backend: {{ versao.version }}</v-list-item-title>
                        <v-list-item-subtitle>Atualizado em: {{ versao.updateIn }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <template v-slot:prepend>
                        <v-list-item-icon>
                            <v-icon size="x-large" color="green" class="mr-3">mdi-view-quilt-outline</v-icon>
                        </v-list-item-icon>
                    </template>
                    <v-list-item-content>
                        <v-list-item-title>Versão Frontend: 6.2.12</v-list-item-title>
                        <v-list-item-subtitle>Atualizado em: 01/10/2025 às 14:35</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Components
import BaseDialog from '@/components/dialog/BaseDialog.vue';

// Models
import type { Version } from '@/models/relatoriosModels/relatoriosModels';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Service
import { relatoriosServices } from '@/services/relatoriosService';

// Vue
import { computed, onBeforeMount, ref } from 'vue';

const visualizar = defineModel<boolean>('visualizar', { required: true });
const dialogState = computed({
    get: () => ({
        visualizar: visualizar.value,
        maxWidth: 500,
        maxHeight: 800
    }),
    set: (newValue) => {
        visualizar.value = newValue.visualizar;
    }
});

const versao = ref<Version>({
    version: '',
    updateIn: ''
})

async function getVersion() {
    try {
        versao.value = await relatoriosServices.getVersion();
    } catch (error) {
        useSnackbarStore().showSnackbar('Erro ao consultar a versão atual: ' + error, 'red')
        throw error
    }
}

onBeforeMount(async () => {
    await getVersion();
})

</script>
