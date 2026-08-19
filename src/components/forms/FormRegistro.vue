<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emits('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-row density="compact">
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="registro.nome"
          :rules="[rules.required(), rules.maxLength(100)]"
          :label="t('forms.formRegistro.inputNome.label')"
          counter="100"
          variant="outlined"
          density="compact"
          autocomplete="off"
          clearable
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="registro.email"
          :rules="[rules.required(), rules.email(), rules.maxLength(100)]"
          :label="t('forms.formRegistro.inputEmail.label')"
          counter="100"
          variant="outlined"
          density="compact"
          autocomplete="off"
          clearable
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="registro.senha"
          :rules="[rules.required(), rules.minLength(8), rules.maxLength(100)]"
          :type="mostrarSenha ? 'text' : 'password'"
          :label="t('forms.formRegistro.inputSenha.label')"
          counter="100"
          variant="outlined"
          density="compact"
          autocomplete="off"
          clearable
        >
          <template #append-inner>
            <v-btn
              :icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
              density="compact"
              variant="text"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </v-text-field>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="registro.confirmarSenha"
          :rules="[rules.required(), rulesPersonalizadas.equals(() => registro.senha)]"
          :type="mostrarSenha ? 'text' : 'password'"
          :label="t('forms.formRegistro.inputConfirmarSenha.label')"
          density="compact"
          variant="outlined"
          autocomplete="off"
          clearable
        >
          <template #append-inner>
            <v-btn
              :icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
              variant="text"
              density="compact"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <slot name="actions" />
  </BaseForm>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import { criarRegistroPadrao, type IUsuarioSolicitacaoAcesso } from '@/models/model/core/usuario.solicitacao.model';

// Utils
import { rulesPersonalizadas } from '@/utils/rules';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';

type TEmits = {
  onSubmit: [];
};
const emits = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const registro = defineModel<IUsuarioSolicitacaoAcesso>('registro', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const mostrarSenha = ref(false);

/**
 * @description Métodos expostos pelo formulário de registro.
 * @property {() => Promise<void>} refreshForm - Restaura o estado original do formulário.
 * @property {() => void} submit - Dispara a validação e submit do formulário.
 */
export interface IFormRegistroExpose {
  refreshForm: () => Promise<void>;
  submit: () => void;
}

async function refreshForm(): Promise<void> {
  if (!baseFormRef.value) return;
  await baseFormRef.value.refreshForm(() => criarRegistroPadrao());
}

// Expose
defineExpose({
  refreshForm,
  submit: () => baseFormRef.value?.submit(),
} satisfies IFormRegistroExpose);
</script>
