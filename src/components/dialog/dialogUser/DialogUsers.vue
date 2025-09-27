<template>
    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-card-title class="mb-3">
                <v-icon>{{dialogUsuarios.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'}}</v-icon>
                {{ dialogUsuarios.isEditing ? `Editar usuário: ${dialogUsuarios.usuario.idUsuario}` : 'Criar novo usuário'}}
            </v-card-title>
        </template>

        <template #default>
            <FormUser ref="formComponentRef" v-model:usuario="dialogUsuarios.usuario"
            :is-editing="dialogUsuarios.isEditing" />

            <v-row dense class="p-0 m-0">
                <v-col cols="12">
                    <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                        * indica campos obrigatórios
                    </small>
                </v-col>
                <v-col cols="12" v-if="!dialogUsuarios.isEditing">
                    <small class="d-flex justify-center text-caption text-medium-emphasis">
                        O usuário será criado com a senha padrão
                    </small>
                </v-col>
            </v-row>
        </template>

        <template #acoes>
            <v-btn color="warning" variant="plain" @click="clearFields">
                <v-icon class="pt-1">mdi-refresh</v-icon>
                {{ dialogUsuarios.isEditing ? 'Desfazer' : 'Limpar' }}
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
// Components
import FormUser from './FormUser.vue';
import BaseDialog from '@/components/dialog/BaseDialog.vue';

// Classes
import { DialogUsersClass } from './ClassDialogUsers';

// Services
import { usuariosServices } from '@/services/usuariosService';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Vue
import { ref, computed, watch } from 'vue';
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';

const formComponentRef = ref<InstanceType<typeof FormUser> | null>(null);

const dialogUsuarios = defineModel<DialogUsersClass>('dialogUsuarios', { required: true });
const dialogState = computed({
    get: () => ({
        visualizar: dialogUsuarios.value.show,
        maxWidth: 650,
    }),
    set: (newValue) => {
        dialogUsuarios.value.show = newValue.visualizar;
    }
});

const emit = defineEmits<{
    (e: 'operacao-concluida'): void
}>();

watch(() => dialogUsuarios.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
})

function clearFields() {
    dialogUsuarios.value.clearFields();
}

function resetForm() {
    dialogUsuarios.value.closeDialog();
}

async function createNewUser() {
    try {
        await usuariosServices.createUser(dialogUsuarios.value.usuario);
        useSnackbarStore().showSnackbar('Usuário criado com sucesso!', 'success');
        emit('operacao-concluida');
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red');
    }
}

async function updateUser() {
    try {
        await usuariosServices.updateUser(dialogUsuarios.value.usuario);
        useSnackbarStore().showSnackbar('Usuário modificado com sucesso!', 'success');
        emit('operacao-concluida');
        resetForm();
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red');
    }
}

async function submitForm() {
    const isValid = await formComponentRef.value?.validate();
    if (!isValid) return;

    dialogUsuarios.value.isEditing ? await updateUser() : await createNewUser();
}

</script>
