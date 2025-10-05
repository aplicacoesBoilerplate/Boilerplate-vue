<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo v-if="!statusConnectModel">
            <div class="d-flex justify-center">
                <v-icon class="pr-3">mdi-cellphone-wireless</v-icon>
                Conectar ao WhatsApp
            </div>
        </template>

        <template #titulo v-else>
            <div class="d-flex justify-center">
                <v-icon class="pr-3">mdi-cellphone-wireless</v-icon>
                Desconectar WhatsApp
            </div>
        </template>

        <template #default v-if="!statusConnectModel">
            <v-list dense>
                <v-list-item class="d-flex justify-center">
                    <img :src="qrCodeModel.qrcode" />
                </v-list-item>
            </v-list>
        </template>

        <template #default v-else>
            <v-list dense>
                <v-list-item class="d-flex justify-center text-info">
                    Deseja encerrar a sua sessão?
                </v-list-item>
                <!-- Loading -->
                <v-list-item class="d-flex justify-center" v-if="loading">
                    <v-progress-circular color="primary" indeterminate />
                </v-list-item>
            </v-list>
        </template>

        <template #outrasAcoes v-if="statusConnectModel">
            <v-btn color="yellow-lighten-1" variant="plain" @click="logoutSessioWpp()">
                <v-icon class="pt-1">mdi-logout</v-icon>
                Encerrar
            </v-btn>
            <v-spacer />
        </template>

    </BaseDialog>
</template>

<script setup lang="ts">
// Components
import BaseDialog from '../BaseDialog.vue';

// Services
import { wppConnectionServices } from '@/services/wppConnectionServices';

// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Vue
import { computed, ref } from 'vue';

const statusConnectModel = defineModel<boolean>('status', { required: true });
const qrCodeModel = defineModel<{ visualizar: boolean, qrcode: string }>('qrcode', { required: true });
const dialogState = computed({
    get: () => ({
        visualizar: qrCodeModel.value.visualizar,
        maxWidth: 400,
        maxHeight: 1000
    }),
    set: (newValue) => {
        qrCodeModel.value.visualizar = newValue.visualizar;
    }
});

const loading = ref(false)
async function logoutSessioWpp() {
    try {
        loading.value = true
        await wppConnectionServices.logoutSession();
        useSnackbarStore().showSnackbar('Sua sessão será encerrada em alguns instantes...!', 'info');
        setTimeout(() => {
            qrCodeModel.value.visualizar = false
            statusConnectModel.value = false
        }, 3000);

    } catch (error) {
        useSnackbarStore().showSnackbar(`Erro ao encerrar a sessão! ${error}`, 'red');

    } finally {
        loading.value = false
    }
}

</script>
