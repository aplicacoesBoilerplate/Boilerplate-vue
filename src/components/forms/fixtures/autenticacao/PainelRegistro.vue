<template>
  <FormRegistro
    ref="formRegistroRef"
    v-model:registro="registro"
    v-model:valid="formularioValido"
    @onSubmit="emits('solicitarAcesso')"
  >
    <template #actions>
      <AcoesFormularioAutenticacao
        :carregandoSubmit="carregando"
        :submitDesabilitado="!formularioValido"
        :tooltipResetar="tooltipResetar"
        iconeSubmit="mdi-account-plus-outline"
        textoSubmit="Solicitar acesso"
        @resetar="emits('resetar')"
        @submit="submit"
      />
    </template>
  </FormRegistro>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { nextTick, ref } from 'vue';

// Types e Interfaces
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/usuario/IUsuarioSolicitacaoAcesso';

// Componentes
import AcoesFormularioAutenticacao from './AcoesFormularioAutenticacao.vue';
import FormRegistro from '@/components/forms/FormRegistro.vue';

type TProps = {
  /**
   * Define se o submit do registro está em carregamento.
   */
  carregando?: boolean;

  /**
   * Tooltip exibido no botão de reset.
   */
  tooltipResetar: string;
};

const props = withDefaults(defineProps<TProps>(), {
  carregando: false,
});

type TEmits = {
  /**
   * Emitido quando o usuário solicita reset do formulário.
   */
  resetar: [];

  /**
   * Emitido quando o formulário de registro é submetido.
   */
  solicitarAcesso: [];
};
const emits = defineEmits<TEmits>();

// Reativas - Model
const registro = defineModel<IUsuarioSolicitacaoAcesso>('registro', { required: true });
const formularioValido = defineModel<boolean>('valid', { default: false });

// Reativas - Ref
const formRegistroRef = ref<InstanceType<typeof FormRegistro> | null>(null);

// Funções
async function reset(): Promise<void> {
  await nextTick();
  formRegistroRef.value?.reset();
}

async function submit(): Promise<void> {
  await nextTick();
  await formRegistroRef.value?.submit();
}

// Expose
defineExpose({
  reset,
  submit,
});
</script>
