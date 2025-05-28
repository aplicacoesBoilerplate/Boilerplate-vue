<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card prepend-icon="mdi-delete-outline" title="Confirme a sua senha antes de completar essa operação">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field clearable v-model="confirmarSenha.email" :rules="[rules.required, rules.emailFormat]"
                label="email*" disabled counter>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="confirmarSenha.senha" :rules="[rules.required, rules.min, rules.max]"
                :type="showPassword1 ? 'text' : 'password'" hint="Mínimo de 8 caracteres" label="Senha*" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="confirmarSenha.confirmarSenha"
                :rules="[rules.required, rules.equals(() => confirmarSenha.senha)]"
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

        <v-divider />

        <v-card-actions>
          <v-btn color="warning" variant="plain" @click="clearFields()"><v-icon class="pt-1">mdi-refresh</v-icon>
            Refresh</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="red" variant="plain" @click="resetForm()"><v-icon class="pt-1">mdi-close</v-icon>Close</v-btn>

          <v-btn color="success" variant="tonal" :disabled="!formIsValid"
            type="submit"><v-icon class="pt-1">mdi-check</v-icon>>Confirmar</v-btn>
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
import { ref, computed, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)

// Visualizar a senha inserida
const showPassword1 = ref(false)
const showPassword2 = ref(false)

interface Props {
  modelValue: ConfirmarSenhaClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: ConfirmarSenhaClass): void
}>()

const confirmarSenha = computed(() => props.modelValue)
const exibir = computed({
  get: () => confirmarSenha.value.show,
  set: (val) => confirmarSenha.value.show = val
})

watch(exibir, async (val) => {
  if (!val) {
    resetForm()
  } else {
    try {
      const usuarioToken = await authServices().getByToken()
      confirmarSenha.value.email = usuarioToken.email
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    }
  }
});

function clearFields() {
  confirmarSenha.value.clearFields()
  showPassword1.value = false
  showPassword2.value = false
  emit('update:modelValue', confirmarSenha.value)
}

function resetForm() {
  clearFields()
  confirmarSenha.value.closeDialog()
}

async function submitForm() {
  try {
    if (confirmarSenha.value.callback)
      await confirmarSenha.value.executeCallback()

    resetForm()
    useSnackbarStore().showSnackbar('Operação realizada com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  }
}

</script>
