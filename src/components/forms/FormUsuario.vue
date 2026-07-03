<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emit('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-row dense>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="usuario.nome"
          :counter="30"
          :rules="[rules.required(), rules.maxLength(30)]"
          :label="t('forms.formUser.inputUsername.label')"
          :hint="t('forms.formUser.inputUsername.hint')"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="usuario.email"
          :counter="150"
          :rules="[rules.required(), rules.email(), rules.maxLength(150)]"
          :label="t('forms.formUser.inputEmail.label')"
          :hint="t('forms.formUser.inputEmail.hint')"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <SelectRole
          v-model="usuario.papel"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-mask-input
          v-model="usuario.telefone"
          mask="(##) #####-####"
          placeholder="(##) #####-####"
          :label="t('forms.formUser.inputPhoneNumber.label')"
          density="compact"
          variant="outlined"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="usuario.notificar"
          :label="t('forms.formUser.inputReceiveNotifications.label')"
          color="success"
          hideDetails
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="usuario.ativo"
          :label="t('forms.formUser.inputUserActive.label')"
          color="success"
          hideDetails
        />
      </v-col>
    </v-row>
  </BaseForm>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';
import SelectRole from '@/components/forms/fixtures/SelectRole.vue';

type TEmits = {
  onSubmit: [];
};
const emit = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const formIsValid = defineModel<boolean>('valido', { default: false });
const usuario = defineModel<IUsuario>('usuario', { required: true });

// Reativas - Ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);

// Expose
defineExpose({
  reset: () => baseFormRef.value?.resetValidation(),
  submit: () => baseFormRef.value?.submit(),
});
</script>
