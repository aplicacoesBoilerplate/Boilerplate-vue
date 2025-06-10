<template>
  <div class="pa-4 text-center">
    <v-card prepend-icon="mdi-account" title="Perfil de usuário">
      <v-card-text>
        <v-row dense>
          <v-col md="1" sm="2">
            <v-text-field clearable label="Registro" disabled v-model="model.idUsuario"></v-text-field>
          </v-col>

          <v-col md="3" sm="4">
            <InputUpperCase v-model:="model.nome" :style="{ label: 'Nome', maxWidth: 1000 }" />
          </v-col>

          <v-col md="8" sm="6">
            <InputUpperCase v-model:="model.email"
              :style="{ label: 'Email', hint: 'Atualizar seu e-mail altera seu login no sistema!', maxWidth: 10000 }" />
          </v-col>

          <v-col md="5" sm="4">
            <v-autocomplete clearable v-model="model.permissao" label="Permissão*"
              :disabled="permissao != 'ADMINISTRADOR' && permissao != 'ADMINISTRADOR_AUTORIZADO'" :items="permissoes"
              :item-title="'chave'" :item-value="'valor'"
              :rules="[rules.required, rules.includes(PermissoesUsuarios)]" />
          </v-col>

          <v-col md="2" sm="4" class="d-flex justify-center">
            <v-switch v-model="model.autorizaSaida" color="success" label="Autoriza saídas"
              :disabled="permissao != 'ADMINISTRADOR' && permissao != 'ADMINISTRADOR_AUTORIZADO'" />
          </v-col>

          <v-col md="5" sm="4" class="d-flex justify-center">
            <v-date-input clearable label="Data expiração da conta" prepend-icon="" prepend-inner-icon="$calendar"
              variant="solo" :disabled="permissao != 'ADMINISTRADOR' && permissao != 'ADMINISTRADOR_AUTORIZADO'" />
          </v-col>
        </v-row>

        <div class="pb-5">
          <v-btn color="warning" variant="plain" rounded density="compact" text="Alterar senha"
            @click="confirmarUsuario()"><v-icon>mdi-lock-reset</v-icon> Alterar senha</v-btn>
        </div>

        <v-form ref="formRef" v-model="formIsValid" @submit.prevent="alterarSenha()">
          <v-row class="d-flex justify-center" dense v-if="usuarioConfirmado">

            <v-col cols="4">
              <v-text-field clearable v-model="alterarSenhaUsuario.senhaUsuario" :rules="[rules.required]"
                :type="showPassword1 ? 'text' : 'password'" hint="Insira novamente a sua senha" persistent-hint
                label="Senha atual*" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field clearable v-model="alterarSenhaUsuario.novaSenha"
                :rules="[rules.required, rules.min, rules.max]" :type="showPassword2 ? 'text' : 'password'"
                hint="Mínimo de 8 caracteres" label="Nova senha*" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword2 = !showPassword2"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field clearable v-model="alterarSenhaUsuario.confirmarNovaSenha"
                :rules="[rules.required, rules.equals(() => alterarSenhaUsuario.novaSenha)]"
                :type="showPassword3 ? 'text' : 'password'" hint="Deve coincidir com a nova senha"
                label="Confirmar sua nova senha*" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword3 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword3 = !showPassword3"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>

            <v-btn type="submit" :disabled="!formIsValid" color="success" variant="outlined">Alterar senha</v-btn>

          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="red" variant="plain" :disabled="!alteracao" @click="resetModel()">
          <v-icon class="pt-1">mdi-close</v-icon> Cancelar
        </v-btn>

        <v-btn color="success" variant="tonal" :disabled="!alteracao" @click="modificarUsuario()">
          <v-icon>mdi-content-save-check</v-icon> Atualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <DialogConfirmarSenha :model-value="confirmarSenha" @update:modelValue="clonarObjetoConfirmarSenha(confirmarSenha)" />
</template>

<script setup lang="ts">
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue';
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue'; // Componente visual para confirmação de senha

// Classes
import type { AlterarSenha } from '@/models/authModels/LoginModel';

// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { usuarioAutenticado } from '@/stores/usuarioAutenticado';

// Models
import { PermissoesUsuarios, PermissoesUsuariosAutoComplete, type UsuarioConsulta } from '@/models/usersModels/UsuariosModels';

// Services
import { usuariosServices } from '@/services/usuariosService';
import { authServices } from '@/services/authService';
import { rules } from '@/utils/rules'

// Vue
import { ref, onMounted, computed } from 'vue';

const confirmarSenha = ref(new ConfirmarSenhaClass())
const usuarioStore = usuarioAutenticado()
const permissao = usuarioAutenticado().usuario.permissao
const model = ref<UsuarioConsulta>({
  nome: '',
  email: '',
})
const usuarioOriginal = ref<UsuarioConsulta>()
const usuarioConfirmado = ref(false)
const permissoes = PermissoesUsuariosAutoComplete
const formRef = ref()
const formIsValid = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const showPassword3 = ref(false)
const alterarSenhaUsuario = ref<AlterarSenha>({
  emailUsuario: '',
  senhaUsuario: '',
  novaSenha: '',
  confirmarNovaSenha: ''
})

onMounted(async () => {
  usuarioStore.usuario = await authServices().getByToken()
  model.value = clone<UsuarioConsulta>(usuarioStore.usuario)
  usuarioOriginal.value = clone<UsuarioConsulta>(usuarioStore.usuario)
})

function clone<T>(pObj: T): T {
  return JSON.parse(JSON.stringify(pObj))
}

const alteracao = computed(() => {
  return JSON.stringify(model.value) !== JSON.stringify(usuarioOriginal.value)
})

function resetModel() {
  model.value = clone<UsuarioConsulta>(usuarioStore.usuario)
}

function abrirDialogConfirmacao(callback: () => Promise<void>) {
  confirmarSenha.value.setCallback(callback)
  confirmarSenha.value.openDialog()
}

function confirmarUsuario() {
  abrirDialogConfirmacao(async () => {
    try {
      usuarioConfirmado.value = true
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    }
  })
}

async function alterarSenha() {
  try {
    alterarSenhaUsuario.value.emailUsuario = usuarioOriginal.value?.email!

    await authServices().alterarSenha(alterarSenhaUsuario.value)
    usuarioConfirmado.value = false
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

async function modificarUsuario() {
  try {
    await usuariosServices.updateUser(model.value)
    usuarioStore.usuario = model.value
    useSnackbarStore().showSnackbar('Perfil atualizado com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

function clonarObjetoConfirmarSenha(val: ConfirmarSenhaClass) {
  return () => Object.assign(confirmarSenha, val)
}

</script>
