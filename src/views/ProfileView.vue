<template>
  <div class="pa-4 text-center">
    <v-card prepend-icon="mdi-account" title="Perfil de usuário" class="mx-auto" max-width="1000">
      <v-card-text>
        <v-row dense>
          <v-col lg="2" md="2" sm="2" cols="3">
            <v-text-field clearable label="Registro" disabled v-model="model.idUsuario"></v-text-field>
          </v-col>

          <v-col lg="4" md="4" sm="10" cols="9">
            <InputUpperCase v-model:="model.nome"
              :style="{ label: 'Nome', maxWidth: 1000, inputVariant: 'outlined' }" />
          </v-col>

          <v-col lg="6" md="6" cols="12">
            <InputUpperCase v-model:="model.email"
              :style="{ label: 'Email', hint: 'Atualizar seu e-mail altera seu login no sistema!', maxWidth: 10000, inputVariant: 'outlined' }" />
          </v-col>

          <v-col lg="5" md="6" cols="12">
            <v-autocomplete clearable v-model="model.permissao" label="Permissão*" :disabled="!permissao"
              :items="permissoes" :item-title="'chave'" :item-value="'valor'" variant="outlined"
              :rules="[rules.required, rules.includes(PermissoesUsuarios)]" />
          </v-col>

          <v-col lg="3" cols="6">
            <InputUpperCase v-model:="model.celularUsuario" v-telefone-mask
              :style="{ label: 'Telefone/Celular', hint: 'Contato para notificações via WhastsApp', maxWidth: 10000, inputVariant: 'outlined' }" />
          </v-col>

          <v-col lg="4" md="4" cols="6" class="d-flex justify-center">
            <v-switch v-model="model.receberNotificacoes" color="success" label="Receber notificações"
              variant="outlined" />
          </v-col>

          <v-col lg="4" md="4" sm="4" cols="6" class="d-flex justify-center">
            <v-switch v-model="model.autorizaSaida" color="success" label="Autoriza saídas" variant="outlined"
              :disabled="!permissao" />
          </v-col>

          <v-col lg="4" sm="4" cols="6" class="d-flex justify-center">
            <DateTimePicker v-model="model.contaExpiraEm" label="Data expiração da conta" variant="outlined"
              :disabled="!permissao" />
          </v-col>

          <v-col lg="4" md="12" sm="4" cols="12" class="d-flex justify-center align-center">
            <v-btn color="warning" variant="plain" rounded density="compact" text="Alterar senha"
              @click="confirmarUsuario()"><v-icon>mdi-lock-reset</v-icon>Alterar senha</v-btn>
          </v-col>
        </v-row>

        <v-form ref="formRef" v-model="formIsValid" @submit.prevent="alterarSenha()">
          <v-row class="d-flex justify-center" dense v-if="usuarioConfirmado">

            <v-col cols="4">
              <v-text-field clearable v-model="alterarSenhaUsuario.senhaUsuario" :rules="[rules.required]"
                :type="showPassword1 ? 'text' : 'password'" hint="Insira novamente a sua senha atual" persistent-hint
                label="Senha atual*" variant="outlined" counter>

                <template v-slot:append-inner>
                  <v-btn :icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'" @click="showPassword1 = !showPassword1"
                    variant="text" />
                </template>

              </v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field clearable v-model="alterarSenhaUsuario.novaSenha"
                :rules="[rules.required, rules.min, rules.max]" :type="showPassword2 ? 'text' : 'password'"
                hint="Mínimo de 8 caracteres" label="Nova senha*" variant="outlined" counter>

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
                label="Confirmar sua nova senha*" variant="outlined" counter>

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
import DateTimePicker from '@/components/DateTimePicker.vue'; // Componente visual para data e hora
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
import { ref, computed, onBeforeMount } from 'vue';

const confirmarSenha = ref(new ConfirmarSenhaClass())
const usuarioStore = usuarioAutenticado()
const permissao = ref()
const model = ref<UsuarioConsulta>({
  nome: '',
  email: '@SIERMOVEIS.COM.BR',
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

onBeforeMount(async () => {
  await authServices.getByToken()
  const usuarioPerfil = usuarioAutenticado().usuario
  model.value = clone<UsuarioConsulta>(usuarioPerfil)
  usuarioOriginal.value = clone<UsuarioConsulta>(usuarioPerfil)

  permissao.value = usuarioPerfil.permissao == 'ADMINISTRADOR' ||
    usuarioPerfil.permissao == 'ADMINISTRADOR_AUTORIZADO'
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
    await authServices.alterarSenha(alterarSenhaUsuario.value)
    usuarioConfirmado.value = false
    useSnackbarStore().showSnackbar('Senha alterada com sucesso!', 'success')
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
    usuarioOriginal.value = clone<UsuarioConsulta>(model.value)
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

function clonarObjetoConfirmarSenha(val: ConfirmarSenhaClass) {
  Object.assign(confirmarSenha, val)
}

</script>
