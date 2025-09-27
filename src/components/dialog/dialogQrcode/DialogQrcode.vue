<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>mdi-cellphone-wireless</v-icon>
            Conectar ao WhatsApp
        </template>

        <template #default v-if="statusConnectModel">
            <v-list dense>
                <v-list-item class="d-flex justify-center">
                    <img :src="qrCodeModel.qrcode" />
                </v-list-item>
            </v-list>
        </template>

        <template #default v-else>
            <v-list dense>
                <v-list-item class="d-flex justify-center">

                </v-list-item>
            </v-list>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Components
import BaseDialog from '../BaseDialog.vue';

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

</script>
