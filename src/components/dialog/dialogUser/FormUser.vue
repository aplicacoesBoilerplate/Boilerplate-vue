<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense>
            <v-col cols="12" md="6">
                <InputUpperCase v-model="usuario.nome" :style="{
                    inputVariant: 'outlined',
                    label: 'Nome de usuário*',
                    maxWidth: 650,
                    counter: 100,
                }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="12" md="6">
                <InputUpperCase v-model="usuario.email" :style="{
                    inputVariant: 'outlined',
                    label: 'E-mail*',
                    hint: 'E-mail de acesso',
                    maxWidth: 650,
                    counter: 100,
                }" :rules="[rules.required, rules.min, rules.max, rules.emailFormat]" />
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
                <v-autocomplete clearable v-model="usuario.permissao" label="Permissão*" :items="permissoesAutoComplete"
                    :item-title="'chave'" :item-value="'valor'" variant="outlined"
                    :rules="[rules.required, rules.includes(permissoesRules)]" />
            </v-col>
        </v-row>

        <v-row dense v-if="isEditing">
            <v-col cols="6" class="d-flex justify-center">
                <v-switch v-model="usuario.contaBloqueada" color="red" label="Status bloqueio" />
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
                <v-switch v-model="usuario.ativo" color="success" label="Status conta ativa" />
            </v-col>
        </v-row>

        <v-row dense v-if="isEditing">
            <v-col cols="6" class="d-flex justify-center">
                <v-switch v-model="usuario.autorizaSaida" color="success" label="Autoriza saídas"></v-switch>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
                <DateTimePicker v-model="usuario.contaExpiraEm" label="Data expiração da conta" variant="outlined" />
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
// Components
import DateTimePicker from '@/components/DateTimePicker.vue';
import InputUpperCase from '@/components/InputUpperCase.vue';

// Models
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';
import { PermissoesUsuarios, PermissoesUsuariosAutoComplete } from '@/models/usersModels/UsuariosModels';

// Utils
import { rules } from '@/utils/rules';

// Vue
import { ref } from 'vue';

defineProps<{
    isEditing: boolean;
}>();

const usuario = defineModel<UsuarioConsulta>('usuario', { required: true });

const formRef = ref<any>(null);
const formIsValid = ref(false);
const permissoesRules = PermissoesUsuarios;
const permissoesAutoComplete = PermissoesUsuariosAutoComplete;

const validate = async (): Promise<boolean> => {
    const { valid } = await formRef.value?.validate();
    return valid;
};

defineExpose({
    validate,
    formIsValid
});

</script>
