<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emits('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-row dense>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="registro.nome"
          :rules="[rules.required(), rules.maxLength(100)]"
          counter="100"
          label="Nome"
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
          counter="100"
          label="E-mail"
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
          counter="100"
          label="Senha"
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
          label="Confirmar senha"
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
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/usuario/IUsuarioSolicitacaoAcesso';

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

// Reativas - Model
const registro = defineModel<IUsuarioSolicitacaoAcesso>('registro', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const mostrarSenha = ref(false);

// Expose
defineExpose({
  reset: () => baseFormRef.value?.resetValidation(),
  submit: () => baseFormRef.value?.submit(),
});
</script>
