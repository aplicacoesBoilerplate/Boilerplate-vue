<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>mdi-ticket-confirmation-outline</v-icon>
            Confirme a sua senha antes de completar essa operação
        </template>

        <template #default>
            <FormConfirmarSenha ref="formComponentRef" v-model:confirmar="dialogConfirmarSenha.confirmarSenha" />

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
                Limpar
            </v-btn>

            <v-spacer />

            <v-btn color="red" variant="plain" @click="resetForm()">
                <v-icon class="pt-1">mdi-close</v-icon>
                Fechar
            </v-btn>

            <v-btn color="success" variant="tonal" :disabled="!formComponentRef?.formIsValid" @click="submitForm()">
                <v-icon class="pt-1">mdi-check</v-icon>
                Confirmar
            </v-btn>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
// Components
import BaseDialog from '../BaseDialog.vue'
import FormConfirmarSenha from './FormConfirmarSenha.vue'

// Classes
import { ConfirmarSenhaClass } from './ClassConfirmarSenha'

// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Services
import { authServices } from '@/services/authService'

// Vue
import { computed, ref, watch } from 'vue'

const formComponentRef = ref<InstanceType<typeof FormConfirmarSenha> | null>(null);

const dialogConfirmarSenha = defineModel<ConfirmarSenhaClass>('dialogConfirmarSenha', { required: true });
const dialogState = computed({
    get: () => ({
        visualizar: dialogConfirmarSenha.value.show,
        maxWidth: 700,
    }),
    set: (newValue) => {
        dialogConfirmarSenha.value.show = newValue.visualizar;
    }
});

watch(() => dialogConfirmarSenha.value.show, async (isOpen) => {
    if (!isOpen) {
        resetForm()
    } else {
        try {
            const usuarioToken = await authServices.getByToken()
            dialogConfirmarSenha.value.confirmarSenha.email_usuario = usuarioToken.email
        } catch (error) {
            useSnackbarStore().showSnackbar(error, 'red')
            throw error
        }
    }
});

function clearFields() {
    dialogConfirmarSenha.value.clearFields()
}

function resetForm() {
    dialogConfirmarSenha.value.closeDialog()
}

async function submitForm() {
    const isValid = await formComponentRef.value?.validate();
    if (!isValid) return;
    try {
        if (dialogConfirmarSenha.value.callback)
            await dialogConfirmarSenha.value.executeCallback()
        resetForm()
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
    }
}

</script>
