<template>
  <SnackbarNotifications />
  <div>
    <v-card class="mx-auto" width="650">
      <v-card-title class="d-flex justify-center pt-5">
        Dados de acesso
      </v-card-title>
      <v-form ref="formRef" v-model="formIsValid" @submit.prevent="solicitarAcesso()">
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <InputUpperCase v-model:="newUser.nome" :style="{
                  label: 'Nome de usuário*',
                  counter: 100
                }" :rules="[rules.required, rules.max]" />
              </v-col>

              <v-col cols="6">
                <InputUpperCase v-model:="newUser.email" :style="{
                  label: 'Email*',
                  counter: 100
                }" :rules="[rules.required, rules.emailFormat]" />
              </v-col>

              <v-col cols="6">
                <v-text-field clearable v-model="newUser.senha" :rules="[rules.required, rules.min, rules.max]"
                  :type="showPassword1 ? 'text' : 'password'" hint="Mínimo de 8 caracteres" label="Senha*" counter>
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field clearable v-model="newUser.confirmarSenha"
                  :rules="[rules.required, rules.equals(() => newUser.senha)]"
                  :type="showPassword2 ? 'text' : 'password'" label="Confirmar sua senha*" counter>
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword2 = !showPassword2"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn class="mt-2" type="submit" :disabled="!formIsValid" block color="success">Realizar solicitação de
                  acesso
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case
import { usuariosServices } from '@/services/usuariosService'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import SnackbarNotifications from './Snackbar.vue'
import { rules } from '@/utils/rules'
import { ref } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const newUser = ref(
  {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  }
)

// Mesmo método de criar usuário porém sem autenticação e com um body menor
async function solicitarAcesso() {
  try {
    await usuariosServices.solicitarAcesso(newUser.value)
    useSnackbarStore().showSnackbar('Conta registrada, aguarde a liberação de um administrador', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

</script>
