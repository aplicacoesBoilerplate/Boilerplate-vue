<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense>
            <v-col cols="12">
                <v-text-field clearable v-model="dialogConfirmarSenha.email_usuario"
                    :rules="[rules.required, rules.emailFormat]" label="email*" variant="outlined" disabled counter>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field clearable v-model="dialogConfirmarSenha.senha_usuario"
                    :rules="[rules.required, rules.max]" :type="showPassword1 ? 'text' : 'password'"
                    hint="Insira a sua senha de login" label="Senha*" variant="outlined" counter>

                    <template v-slot:append-inner>
                        <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                            variant="text" />
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field clearable v-model="dialogConfirmarSenha.confirmar_senha"
                    :rules="[rules.required, rules.equals(() => dialogConfirmarSenha.senha_usuario)]"
                    :type="showPassword2 ? 'text' : 'password'" label="Confirmar sua senha*"
                    hint="As senhas devem coincidir" variant="outlined" counter>

                    <template v-slot:append-inner>
                        <v-btn :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword2 = !showPassword2"
                            variant="text" />
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
// Models
import type { ConfirmarSenha } from '@/models/authModels/LoginModel';

// Utils
import { rules } from '@/utils/rules';
// Vue
import { ref } from 'vue';

// Visualizar a senha inserida
const showPassword1 = ref(false)
const showPassword2 = ref(false)

const dialogConfirmarSenha = defineModel<ConfirmarSenha>('confirmar', { required: true });

const formRef = ref<any>(null);
const formIsValid = ref(false);

const validate = async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
};

defineExpose({
    validate,
    formIsValid
});

</script>
