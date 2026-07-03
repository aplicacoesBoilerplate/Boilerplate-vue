<template>
  <v-form
    ref="formRef"
    v-model="formIsValid"
  >
    <v-row dense>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="usuario.nome"
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
          v-model="usuario.email"
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
          v-model="usuario.papel"
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
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="usuario.ativo"
          :label="t('forms.formUser.inputUserActive.label')"
          color="success"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import { PAPEIS_VALIDOS, type IUsuario } from '@/models/model/usuario/lUsuario';

const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);
const formIsValid = defineModel<boolean>('valido', { default: false });
const usuario = defineModel<IUsuario>('usuario', { required: true });

defineExpose({
  reset: () => formRef.value?.reset(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  },
});

</script>
