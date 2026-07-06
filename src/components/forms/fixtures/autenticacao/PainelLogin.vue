<template>
  <FormLogin
    ref="formLoginRef"
    v-model:login="login"
    v-model:valid="formularioValido"
    @onSubmit="emits('entrar')"
  >
    <template #actions>
      <AcoesFormularioAutenticacao
        :carregandoGoogle="carregandoGoogle"
        :carregandoSubmit="carregando"
        :submitDesabilitado="!formularioValido"
        :tooltipResetar="tooltipResetar"
        iconeSubmit="mdi-login-variant"
        textoSubmit="Entrar"
        mostrarGoogle
        mostrarRecuperarSenha
        @autenticarGoogle="(pCredential) => emits('autenticarGoogle', pCredential)"
        @erroGoogle="(pMensagem) => emits('erroGoogle', pMensagem)"
        @recuperarSenha="emits('recuperarSenha')"
        @resetar="emits('resetar')"
        @submit="submit"
      />
    </template>
  </FormLogin>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { nextTick, ref } from 'vue';

// Types e Interfaces
import type { ILogin } from '@/models/model/autenticacao/autenticacao.models';

// Componentes
import AcoesFormularioAutenticacao from './AcoesFormularioAutenticacao.vue';
import FormLogin from '@/components/forms/FormLogin.vue';

type TProps = {
  /**
   * Define se o submit de login está em carregamento.
   */
  carregando?: boolean;

  /**
   * Define se o fluxo de Google está em carregamento.
   */
  carregandoGoogle?: boolean;

  /**
   * Tooltip exibido no botão de reset.
   */
  tooltipResetar: string;
};

const props = withDefaults(defineProps<TProps>(), {
  carregando: false,
  carregandoGoogle: false,
});

type TEmits = {
  /**
   * Emitido quando o usuário aciona o login com Google.
   */
  autenticarGoogle: [credential?: string];

  /**
   * Emitido quando o formulário de login é submetido.
   */
  entrar: [];

  /**
   * Emitido quando o Google não retorna uma credencial válida.
   */
  erroGoogle: [mensagem: string];

  /**
   * Emitido quando o usuário solicita recuperação de senha.
   */
  recuperarSenha: [];

  /**
   * Emitido quando o usuário solicita reset do formulário.
   */
  resetar: [];
};
const emits = defineEmits<TEmits>();

// Reativas - Model
const login = defineModel<ILogin>('login', { required: true });
const formularioValido = defineModel<boolean>('valid', { default: false });

// Reativas - Ref
const formLoginRef = ref<InstanceType<typeof FormLogin> | null>(null);

// Funções
async function reset(): Promise<void> {
  await nextTick();
  formLoginRef.value?.reset();
}

async function submit(): Promise<void> {
  await nextTick();
  await formLoginRef.value?.submit();
}

// Expose
defineExpose({
  reset,
  submit,
});
</script>
