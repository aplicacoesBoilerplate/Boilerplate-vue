<template>
  <v-dialog v-model="dialogConfirmarSenha.show" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card prepend-icon="mdi-delete-outline" title="Confirme a sua senha antes de completar essa operação">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field clearable v-model="dialogConfirmarSenha.email" :rules="[rules.required, rules.emailFormat]"
                label="email*" variant="outlined" disabled counter>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="dialogConfirmarSenha.senha" :rules="[rules.required, rules.max]"
                :type="showPassword1 ? 'text' : 'password'" hint="Insira a sua senha de login" label="Senha*"
                variant="outlined" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="dialogConfirmarSenha.confirmarSenha"
                :rules="[rules.required, rules.equals(() => dialogConfirmarSenha.senha)]"
                :type="showPassword2 ? 'text' : 'password'" label="Confirmar sua senha*"
                hint="As senhas devem coincidir" variant="outlined" counter>

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

        <v-divider />

        <v-card-actions class="sticky-actions">
          <v-btn color="warning" variant="plain" @click="clearFields()"><v-icon class="pt-1">mdi-refresh</v-icon>
            Limpar</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="red" variant="plain" @click="resetForm()"><v-icon class="pt-1">mdi-close</v-icon>Fechar</v-btn>

          <v-btn color="success" variant="tonal" :disabled="!formIsValid" type="submit"><v-icon
              class="pt-1">mdi-check</v-icon>Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Classes
import { ConfirmarSenhaClass } from './ClassConfirmarSenha'

// Models

// Services
import { rules } from '@/utils/rules'
import { authServices } from '@/services/authService'

// Vue
import { ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)

// Visualizar a senha inserida
const showPassword1 = ref(false)
const showPassword2 = ref(false)

const dialogConfirmarSenha = defineModel<ConfirmarSenhaClass>('dialogConfirmarSenha', {
  required: true
})

watch(() => dialogConfirmarSenha.value.show, async (val) => {
  if (!val) {
    resetForm()
  } else {
    try {
      const usuarioToken = await authServices.getByToken()
      dialogConfirmarSenha.value.email = usuarioToken.email
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    }
  }
});

function clearFields() {
  dialogConfirmarSenha.value.clearFields()
  showPassword1.value = false
  showPassword2.value = false
}

function resetForm() {
  clearFields()
  dialogConfirmarSenha.value.closeDialog()
}

async function submitForm() {
  try {
    if (dialogConfirmarSenha.value.callback)
      await dialogConfirmarSenha.value.executeCallback()

    resetForm()
    useSnackbarStore().showSnackbar('Senha confirmada!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  }
}

</script>
