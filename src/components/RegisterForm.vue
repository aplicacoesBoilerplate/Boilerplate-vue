<template>
  <div>
    <v-card class="mx-auto" width="650">
      <v-card-title class="d-flex justify-center pt-5">
        Register your account
      </v-card-title>
      <v-form ref="formRef" v-model="formIsValid">
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <v-text-field clearable v-model="newUser.username" :counter="100" :rules="[rules.required, rules.max]"
                  label="Username*" required />
              </v-col>

              <v-col cols="6">
                <v-text-field clearable v-model="newUser.email" :counter="100"
                  :rules="[rules.required, rules.emailFormat]" label="E-mail*" required />
              </v-col>

              <v-col cols="6">
                <v-text-field clearable v-model="newUser.senha" :rules="[rules.required, rules.min, rules.max]"
                  :type="showPassword1 ? 'text' : 'password'" hint="At least 8 characters" label="Password*" counter>
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field clearable v-model="newUser.confirmarSenha" :rules="[rules.required, rules.equals]"
                  :type="showPassword2 ? 'text' : 'password'" label="Confirm your password*" counter>
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword2 = !showPassword2"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn class="mt-2" type="submit" :disabled="!formIsValid" block color="success">Create your account
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
import { ref } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const newUser = ref(
  {
    username: '',
    email: '',
    senha: '',
    permissao: 'USER',
    bloqueado: true,
    ativo: false,
    confirmarSenha: ''
  }
)

const rules = {
  required: (v: string | number) => !!v || 'Required field',
  emailFormat: (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  },
  min: (v: string | any[]) => v.length >= 8 || 'Min 8 characters',
  max: (v: string | any[]) => v.length <= 100 || 'Max 100 characters',
  equals: (v: string | number) => v == newUser.value.senha || 'Passwords do not match',
}

</script>
