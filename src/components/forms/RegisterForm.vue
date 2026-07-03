<template>
  <div>
    <!-- Loading -->
    <div
      class="d-flex justify-center mb-5"
      v-if="loading"
    >
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card
      class="mx-auto"
      width="650"
    >
      <v-card-title class="d-flex justify-center pt-5"> Dados de acesso </v-card-title>
      <v-form
        ref="formRef"
        v-model="formIsValid"
        @submit.prevent="solicitarAcesso()"
      >
        <v-container class="d-flex justify-center mb-6">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <InputUpperCase
                  v-model="novoUsuario.nome"
                  :style="{
                    label: 'Nome de usuário*',
                    counter: 100,
                    inputVariant: 'outlined',
                  }"
                  :rules="[rules.required(), rules.maxLength(100)]"
                />
              </v-col>

              <v-col cols="6">
                <InputUpperCase
                  v-model="novoUsuario.email"
                  :style="{
                    label: 'Email*',
                    counter: 100,
                    inputVariant: 'outlined',
                  }"
                  :rules="[rules.required(), rules.email(), rules.maxLength(100)]"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  clearable
                  v-model="novoUsuario.senha"
                  :rules="[rules.required(), rules.minLength(8), rules.maxLength(100)]"
                  :type="mostrarSenha ? 'text' : 'password'"
                  hint="Mínimo de 8 caracteres"
                  label="Senha*"
                  variant="outlined"
                  counter
                >
                  <template v-slot:append-inner>
                    <v-btn
                      :icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                      @click="mostrarSenha = !mostrarSenha"
                      variant="text"
                    />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  clearable
                  v-model="novoUsuario.confirmarSenha"
                  :rules="[rules.required(), rulesPersonalizadas.equals(() => novoUsuario.senha)]"
                  :type="mostrarConfirmacaoSenha ? 'text' : 'password'"
                  label="Confirmar sua senha*"
                  variant="outlined"
                  counter
                >
                  <template v-slot:append-inner>
                    <v-btn
                      :icon="mostrarConfirmacaoSenha ? 'mdi-eye' : 'mdi-eye-off'"
                      @click="mostrarConfirmacaoSenha = !mostrarConfirmacaoSenha"
                      variant="text"
                    />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-btn
                  class="mt-2"
                  type="submit"
                  :disabled="!formIsValid"
                  block
                  color="success"
                >
                  Realizar solicitação de acesso
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, nextTick, ref } from 'vue';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/usuario/IUsuarioSolicitacaoAcesso';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';

// Services
import { CUsuarioService } from '@/services/CUsuarioService';

// Utils
import { rulesPersonalizadas } from '@/utils/rules';

// Componentes
import InputUpperCase from '@/components/forms/fixtures/InputUpperCase.vue';

// Composables
const rules = useRules();
const requisicaoService = useRequisicaoService();

// Reativas
const formRef = ref();
const formIsValid = ref(false);
const mostrarSenha = ref(false);
const mostrarConfirmacaoSenha = ref(false);
const dominioEmailPadrao = window.env?.VITE_DOMAIN_EMAIL || import.meta.env.VITE_DOMAIN_EMAIL || '';
const novoUsuario = ref<IUsuarioSolicitacaoAcesso>(criarUsuarioParaRegistroPadrao());

// Computadas
const loading = computed(() => requisicaoService.carregando.value);

// Funções

/**
 * @description Método que cria um usuário padrão para o registro de novo acesso.
 * @returns IUsuarioSolicitacaoAcesso que contém os dados padrão do usuário.
 */
export function criarUsuarioParaRegistroPadrao(): IUsuarioSolicitacaoAcesso {
  return {
    nome: '',
    email: dominioEmailPadrao,
    senha: '',
    confirmarSenha: '',
  };
}

/**
 * @description Método que solicita o registro de um novo acesso.
 */
async function solicitarAcesso(): Promise<void> {
  await requisicaoService.executar({
    metodo: CUsuarioService.solicitarAcesso,
    parametros: novoUsuario.value,
    sucesso: {
      mensagem: 'Conta registrada, aguarde a liberação de um administrador',
      tipo: 'success',
    },
  });

  novoUsuario.value = criarUsuarioParaRegistroPadrao();
  await nextTick();
  formRef.value?.resetValidation();
}
</script>
