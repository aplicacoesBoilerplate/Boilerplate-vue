<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="user.username"
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
          v-model="user.role"
          :rules="[rules.required()]"
          :filter-keys="['title', 'raw.abbr']"
          :items="ValidRoles"
          item-title="name"
          :label="t('forms.formUser.inputRole.label')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-mask-input
          v-model="user.phoneNumber"
          mask="(##) #####-####"
          placeholder="(##) #####-####"
          :label="t('forms.formUser.inputPhoneNumber.label')"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="user.receiveNotifications"
          :label="t('forms.formUser.inputReceiveNotifications.label')"
          color="success"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="user.active"
          :label="t('forms.formUser.inputUserActive.label')"
          color="success"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ValidRoles, type IUser } from '@/classes/models/ModelUser';
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const rules = useRules()
const { t } = useI18n();

const user = defineModel<IUser>('user', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

const formRef = ref<any>(null);

const validate = async () => {
  const { isValid } = await formRef.value?.validate();
  return isValid;
};

const reset = () => {
  formRef.value?.reset();
}

defineExpose({
  reset,
  validate,
  formIsValid
});

</script>
