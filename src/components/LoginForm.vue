<template>
  <SnackbarNotifications />
  <div>
    <v-card class="mx-auto" width="400">
      <v-card-title class="d-flex justify-center pt-5">
        Login
      </v-card-title>
      <v-form ref="formRef" v-model="formIsValid" @submit.prevent="authLogin()">
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12">
                <v-text-field clearable v-model="loginForm.email_usuario" :rules="[rules.required, rules.emailFormat]"
                  label="E-mail" required />
              </v-col>

              <v-col cols="12">
                <v-text-field clearable v-model="loginForm.senha_usuario" :rules="[rules.required]"
                  :type="showPassword ? 'text' : 'password'" label="Password">
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword = !showPassword"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn class="mt-2" type="submit" block color="success">Login
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
import { ref, type Ref } from 'vue'
import { type LoginModel } from '@/models/authModels/LoginModel'
import { authServices } from '@/services/authService'
import type { VForm } from 'vuetify/components'
import { useRouter } from 'vue-router'
import { useSnackbarStore } from '@/components/notifications/notificationsStore'
import SnackbarNotifications from './notifications/SnackbarNotifications.vue'

const formRef: Ref<VForm | null> = ref(null)

const formIsValid = ref(false)
const showPassword = ref(false)
const loginForm = ref<LoginModel>({ email_usuario: '', senha_usuario: '' })
const redirectRouter = useRouter()

const rules = {
  required: (v: string | number) => !!v || 'Required field',
  emailFormat: (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  }
}

const authService = authServices()

async function authLogin() {
  const isValid = await formRef.value?.validate()
  if (!isValid) console.log("inválido: ", (await formRef.value?.validate()!).valid)

  try {
    const token = await authService.login(loginForm.value!)
    redirectRouter.push('/dashboard');
  } catch (err) {
    throw err
  }
}

</script>
