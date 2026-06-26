<template>
  <v-form
    ref="formRef"
    v-model="formIsValid"
  >
    <v-row dense>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="user.nome"
          :counter="30"
          :rules="[rules.required(), rules.maxLength(30)]"
          :label="t('forms.formUser.inputUsername.label')"
          :hint="t('forms.formUser.inputUsername.hint')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="user.email"
          :counter="150"
          :rules="[rules.required(), rules.email(), rules.maxLength(150)]"
          :label="t('forms.formUser.inputEmail.label')"
          :hint="t('forms.formUser.inputEmail.hint')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-autocomplete
          v-model="user.papel"
          :rules="[rules.required()]"
          :filter-keys="['title', 'raw.abbr']"
          :items="PAPEIS_VALIDOS"
          item-title="name"
          :label="t('forms.formUser.inputRole.label')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-mask-input
          v-model="user.telefone"
          mask="(##) #####-####"
          placeholder="(##) #####-####"
          :label="t('forms.formUser.inputPhoneNumber.label')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="user.notificar"
          :label="t('forms.formUser.inputReceiveNotifications.label')"
          color="success"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="user.ativo"
          :label="t('forms.formUser.inputUserActive.label')"
          color="success"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { PAPEIS_VALIDOS, type IUsuario } from '@/models/model/usuario/lUsuario';
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);
const user = defineModel<IUsuario>('usuario', { required: true });
const formIsValid = defineModel<boolean>('valido', { default: false });

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  },
});
</script>
