<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-text-field
      v-model="user.username"
      :counter="30"
      :rules="[rules.required(), rules.maxLength(30)]"
      label="Username"
    />
  </v-form>
</template>

<script setup lang="ts">
import { type IUser } from '@/classes/models/ModelUser';
import { useRules } from 'vuetify/labs/rules'
import { ref } from 'vue';

const rules = useRules()

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
