<template>
  <SnackbarNotifications />
  <div>
    <!-- Loading -->
    <div class="d-flex justify-center mb-5" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>
    <v-card class="mx-auto" width="400">
      <v-card-title class="d-flex justify-center pt-5">
        Login
      </v-card-title>
      <v-form ref="formRef" v-model="formIsValid" @submit.prevent="authLogin()">
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12">
                <InputUpperCase v-model:="loginForm.email_usuario" :style="{ label: 'Email*', maxWidth: 400 }"
                  :rules="[rules.required, rules.emailFormat]" variant="outlined" />
              </v-col>

              <v-col cols="12">
                <v-text-field clearable v-model="loginForm.senha_usuario" :rules="[rules.required]"
                  :type="showPassword ? 'text' : 'password'" label="Senha" variant="outlined">
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword = !showPassword"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn class="mt-2" type="submit" :disabled="!formIsValid" block color="success">Login
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
// Componentes
import SnackbarNotifications from './Snackbar.vue'; // Componente visual da barra de notificações
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case

// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { usuarioAutenticado } from '@/stores/usuarioAutenticado'

// Models
import { type LoginModel } from '@/models/authModels/LoginModel'

// Services
import { rules } from '@/utils/rules'
import { authServices } from '@/services/authService'

// Vue
import type { VForm } from 'vuetify/components'
import { useRouter } from 'vue-router'
import { ref, type Ref } from 'vue'

const formRef: Ref<VForm | null> = ref(null)
const formIsValid = ref(false)
const showPassword = ref(false)
const loginForm = ref<LoginModel>({ email_usuario: '', senha_usuario: '' })
const redirectRouter = useRouter()
const authService = authServices()
const loading = ref(false) // Carregamento

async function authLogin() {
  const isValid = await formRef.value?.validate()
  if (isValid) {
    try {
      loading.value = true
      await authService.login(loginForm.value!)
      redirectRouter.push('/dashboard');
      const usuarioLogado = await authServices().getByToken()
      usuarioAutenticado().usuario = usuarioLogado
      useSnackbarStore().showSnackbar(`Bem-vindo, ${usuarioLogado.nome}!`, 'success')
    } catch (err) {
      useSnackbarStore().showSnackbar(err, 'red')
      throw err
    } finally {
      loading.value = false
    }
  }
}

</script>
