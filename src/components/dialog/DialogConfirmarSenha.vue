<template>
  <v-dialog v-model="dialogConfirmarSenha" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card prepend-icon="mdi-delete-outline" title="Confirme a sua senha antes de completar essa operação">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="confirmarSenha.senha_usuario"
                :rules="[rules.required, rules.min, rules.max]" :type="showPassword1 ? 'text' : 'password'"
                hint="Mínimo de 8 caracteres" label="Senha*" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="confirmarSenha.confirmar_senha"
                :rules="[rules.required, rules.equals(() => confirmarSenha.senha_usuario)]"
                :type="showPassword2 ? 'text' : 'password'" label="Confirmar sua senha*"
                hint="As senhas devem coincidir" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword2 = !showPassword2"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
          </v-row>
          <small class="d-flex justify-center text-caption text-medium-emphasis pt-5">* indica campos obrigatórios
          </small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="warning" variant="plain" @click="clearFields()"><v-icon class="pt-1">mdi-refresh</v-icon>
            Refresh</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="red" variant="plain" @click="dialogStoreConfirmarSenha.closeDialogConfirmarSenha()"><v-icon
              class="pt-1">mdi-close</v-icon>Close</v-btn>

          <v-btn color="success" variant="tonal" :disabled="!formIsValid"
            type="submit"><v-icon>mdi-content-save-check</v-icon class="pt-1">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { rules } from '@/utils/rules'
import { useDialogStoreConfirmarSenha } from '@/stores/dialogStoreConfirmaSenha'
import { authServices } from '@/services/authService'
import type { ConfirmarSenha } from '@/models/authModels/LoginModel'
import { useSnackbarStore } from '@/stores/SnackbarStore'

const formRef = ref()
const formIsValid = ref(false)

const confirmarSenha = ref<ConfirmarSenha>({
  email_usuario: '',
  senha_usuario: '',
  confirmar_senha: ''
})

const showPassword1 = ref(false)
const showPassword2 = ref(false)
const dialogStoreConfirmarSenha = useDialogStoreConfirmarSenha()

const dialogConfirmarSenha = computed({
  get: () => dialogStoreConfirmarSenha.showDialogDialogConfirmarSenha,
  set: (val: boolean) => dialogStoreConfirmarSenha.showDialogDialogConfirmarSenha = val
})

watch(dialogConfirmarSenha, (val) => {
  if (!val) {
    resetForm()
  }
});

function clearFields() {
  confirmarSenha.value.senha_usuario = ''
  confirmarSenha.value.confirmar_senha = ''
  showPassword1.value = false
  showPassword2.value = false
}

function resetForm() {
  clearFields()
  dialogStoreConfirmarSenha.closeDialogConfirmarSenha()
}

async function submitForm() {
  try {
    await authServices().confirmarSenha(confirmarSenha.value)

    if (dialogStoreConfirmarSenha.callbackPosSenha)
      await dialogStoreConfirmarSenha.callbackPosSenha()

    dialogStoreConfirmarSenha.closeDialogConfirmarSenha()

    useSnackbarStore().showSnackbar('Operação realizada com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  }
}

</script>
