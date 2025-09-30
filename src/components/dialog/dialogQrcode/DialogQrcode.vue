<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>mdi-cellphone-wireless</v-icon>
            Conectar ao WhatsApp
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
                <v-list-item class="d-flex justify-center">
                    Encerrar sessão?
                </v-list-item>
            </v-list>
        </template>

        <template #outrasAcoes v-if="statusConnectModel">
            <v-btn color="yellow-lighten-1" variant="plain" @click="logoutSessioWpp()">
                <v-icon class="pt-1">mdi-logout</v-icon>
                Encerrar sessão
            </v-btn>
        </template>

    </BaseDialog>
</template>

<script setup lang="ts">
// Components
import BaseDialog from '../BaseDialog.vue';

// Services
import { wppConnectionServices } from '@/services/wppConnectionServices';

// Vue
import { computed } from 'vue';

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

async function logoutSessioWpp() {
    await wppConnectionServices.logoutSession();
}

</script>
