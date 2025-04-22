<template>
  <h1 class="d-flex justify-center mb-6">Register your account</h1>
  <div>
    <v-form v-model="valid">
      <v-container class="d-flex justify-center mb-6">
        <v-col cols="6">
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="firstname" :counter="10" :rules="nameRules" label="First name"
                required></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field v-model="lastname" :counter="10" :rules="nameRules" label="Last name"
                required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rulesPassword.required, rulesPassword.min]" :type="show1 ? 'text' : 'password'"
                hint="At least 8 characters" label="Password" name="input-10-1" counter
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Variáveis reativas
const valid = ref(false)
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const show1 = ref(false)

// Regras de validação para nome
const nameRules = [
  (value: any) => {
    if (value) return true
    return 'Name is required.'
  },
  (value: string | any[]) => {
    if (value?.length <= 10) return true
    return 'Name must be less than 10 characters.'
  },
]

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

const rulesPassword = {
  required: (value: any) => !!value || 'Required.',
  min: (v: string | any[]) => v.length >= 8 || 'Min 8 characters',
  emailMatch: () => (`The email and password you entered don't match`),
}
</script>
