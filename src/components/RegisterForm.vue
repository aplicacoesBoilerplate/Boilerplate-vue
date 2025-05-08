<template>
  <h1 class="d-flex justify-center mb-6">Register your account</h1>
  <div>
    <v-form ref="formRef" v-model="formIsValid">
      <v-container class="d-flex justify-center mb-6">
        <v-col cols="6">
          <v-row>
            <v-col cols="6">
              <v-text-field clearable v-model="newUser.username" :counter="10" :rules="[rules.required]"
                label="Username" required></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field clearable v-model="newUser.email" :rules="[rules.emailFormat]" label="E-mail"
                required></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field clearable v-model="newUser.senha" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" hint="At least 8 characters"
                label="Password" name="input-10-1" counter @click:append="show1 = !show1"></v-text-field>
            </v-col>

            <v-col cols="6" class="d-flex justify-center">
              <v-autocomplete clearable v-model="newUser.permissao" label="Permission" :items="permissions"
                :auto-select-first="true" />
            </v-col>

            <v-col cols="12">
              <v-btn class="mt-2" type="submit" block>Submit
                <v-icon color="success">mdi-check-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-container>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Users } from '@/models/UsersModel'
import { ref } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const show1 = ref(false)
const newUser = ref<Users>(
  {
    username: '',
    email: '',
    senha: '',
    permissao: 'USER',
    bloqueado: true,
    ativo: false
  }
)

const permissions: any[] =
  ['USER', 'ADMIN']

const rules = {
  required: (v: string | number) => !!v || 'Required field',
  emailFormat: (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  },
  min: (v: string | any[]) => v.length >= 8 || 'Min 8 characters',
}

</script>
