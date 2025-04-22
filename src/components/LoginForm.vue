<template>
  <v-app>
    <h1 class="d-flex justify-center mb-6">Login</h1>
    <div>
      <v-form v-model="valid">
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rulesPassword.required, rulesPassword.min]" :type="show1 ? 'text' : 'password'"
                  hint="At least 8 characters" label="Normal with hint text" name="input-10-1" counter
                  @click:append="show1 = !show1"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn class="mt-2" type="submit" block>Submit</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-container>
      </v-form>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const valid = ref(false)
const email = ref('')

// Regras de validação para e-mail
const emailRules = [
  (value: any) => {
    if (value) return true
    return 'E-mail is required.'
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  },
]

// Regras de validação para senha
const rulesPassword = {
  required: (value: any) => !!value || 'Required.',
  min: (v: string | any[]) => v.length >= 8 || 'Min 8 characters',
  emailMatch: () => (`The email and password you entered don't match`),
}

const show1 = ref(false)
const password = ref('Password')


</script>
