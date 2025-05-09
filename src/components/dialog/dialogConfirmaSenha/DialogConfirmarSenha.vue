<template>
  <v-dialog v-model="dialogConfirmarSenha" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card prepend-icon="mdi-delete-outline" title="Confirm your password befor completed this operation">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="confirmOperation.insertPassword"
                :rules="[rules.required, rules.min, rules.max]" :type="showPassword1 ? 'text' : 'password'"
                hint="At least 8 characters" label="Password*" name="input-InsertPassword" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="confirmOperation.confirmPassword" :rules="[rules.required, rules.equals]"
                :type="showPassword2 ? 'text' : 'password'" hint="At least 8 characters" label="Confirm your password*"
                name="input-confirmPassword" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword2 = !showPassword2"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
          </v-row>
          <small class="d-flex justify-center text-caption text-medium-emphasis pt-5">*indicates required
            field
          </small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="warning" variant="plain" @click="clearFields()"><v-icon>mdi-refresh</v-icon> Refresh</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="red" variant="plain"
            @click="dialogStoreConfirmarSenha.closeDialogConfirmarSenha()"><v-icon>mdi-close</v-icon>Close</v-btn>

          <v-btn color="success" variant="tonal" :disabled="!formIsValid"
            type="submit"><v-icon>mdi-content-save-check</v-icon>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDialogStoreConfirmarSenha } from '../dialogConfirmaSenha/dialogStoreConfirmaSenha'

const formRef = ref()
const formIsValid = ref(false)
const rules = {
  required: (v: string | number) => !!v || 'Required field',
  min: (v: string | any[]) => v.length >= 8 || 'Min 8 characters',
  max: (v: string | any[]) => v.length <= 100 || 'Max 100 characters',
  equals: (v: string | number) => v == confirmOperation.value.insertPassword || 'Passwords do not match',
}

const confirmOperation = ref({
  insertPassword: '',
  confirmPassword: ''
})

const showPassword1 = ref(false)
const showPassword2 = ref(false)
const dialogStoreConfirmarSenha = useDialogStoreConfirmarSenha()

const dialogConfirmarSenha = computed({
  get: () => dialogStoreConfirmarSenha.showDialogDialogConfirmarSenha.value,
  set: (val: boolean) => dialogStoreConfirmarSenha.showDialogDialogConfirmarSenha.value = val
})

watch(dialogConfirmarSenha, (val) => {
  if (!val) {
    resetForm()
  }
});

function clearFields() {
  confirmOperation.value.insertPassword = ''
  confirmOperation.value.confirmPassword = ''
  showPassword1.value = false
  showPassword2.value = false
}

function resetForm() {
  clearFields()
  dialogStoreConfirmarSenha.closeDialogConfirmarSenha()
}

async function submitForm() {
  await dialogStoreConfirmarSenha.identificarDelete()
}

</script>
