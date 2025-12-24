<template>
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
                <InputUpperCase v-model:="loginForm.emailUser" :style="{ label: 'Email*', maxWidth: 400 }"
                  :rules="[rules.required, rules.emailFormat]" variant="outlined" />
              </v-col>

              <v-col cols="12">
                <v-text-field clearable v-model="loginForm.passwordUser" :rules="[rules.required]"
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
import InputUpperCase from '@/components/forms/fixtures/InputUpperCase.vue';

// Composables
import { useSnackbar } from '@/composables/useSnackbar';

// Models
import { type ILogin } from '@/classes/models/ModelLogin'

// Services
import { rules } from '@/utils/rules'
import { authServices } from '@/services/authService'

// Vue
import type { VForm } from 'vuetify/components'
import { useRouter } from 'vue-router'
import { ref, type Ref } from 'vue'

const { notify } = useSnackbar();

const formRef: Ref<VForm | null> = ref(null)
const formIsValid = ref(false)
const showPassword = ref(false)
const emailDefalt = window.env?.VITE_DOMAIN_EMAIL || import.meta.env.VITE_DOMAIN_EMAIL;
const loginForm = ref<ILogin>({ emailUser: emailDefalt, passwordUser: '' })
const redirectRouter = useRouter()
const authService = authServices
const loading = ref(false)

async function authLogin() {
  const isValid = await formRef.value?.validate()
  if (isValid) {
    try {
      loading.value = true
      await authService.login(loginForm.value!)
      const usuarioLogado = await authServices.getByToken()

      notify(`Bem-vindo(a), ${usuarioLogado.username}!`, 'success')
    } catch (err) {
      notify(err as string, 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
}

</script>
