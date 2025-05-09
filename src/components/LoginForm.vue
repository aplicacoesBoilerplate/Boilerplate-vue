<template>
  <div>
    <v-card class="mx-auto" width="400">
      <v-card-title class="d-flex justify-center pt-5">
        Login
      </v-card-title>
      <v-form ref="formRef" v-model="formIsValid">
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="12">
                <v-text-field clearable v-model="email" :rules="[rules.required, rules.emailFormat]" label="E-mail"
                  required />
              </v-col>

              <v-col cols="12">
                <v-text-field clearable v-model="password" :rules="[rules.required]"
                  :type="showPassword ? 'text' : 'password'" label="Password">
                  <template v-slot:append-inner>
                    <v-btn :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword = !showPassword"
                      variant="text" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <RouterLink to="/dashboard" custom v-slot="{ navigate }">
                  <v-btn class="mt-2" type="submit" block @click="navigate" :disabled="!formIsValid"
                    color="success">Login
                  </v-btn>
                </RouterLink>
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
const showPassword = ref(false)
const email = ref('')
const password = ref('')

const rules = {
  required: (v: string | number) => !!v || 'Required field',
  emailFormat: (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  }
}
</script>
