<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="user.username"
          :counter="30"
          :rules="[rules.required(), rules.maxLength(30)]"
          label="Username"
          density="compact"
          variant="outlined"
          hint="Fill with your username"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="user.email"
          :counter="150"
          :rules="[rules.required(), rules.email(), rules.maxLength(150)]"
          label="Email"
          density="compact"
          variant="outlined"
          hint="Fill with your email address"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-autocomplete
          v-model="user.role"
          :rules="[rules.required()]"
          :filter-keys="['title', 'raw.abbr']"
          :items="ValidRoles"
          item-title="name"
          label="Role"
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
      <v-mask-input
        v-model="user.phoneNumber"
        mask="(##) #####-####"
        label="Phone Number"
        density="compact"
        variant="outlined"
        placeholder="(##) #####-####"
      />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="user.receiveNotifications"
          label="Receive Notifications"
          color="success"
        />
      </v-col>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="user.active"
          label="User Active"
          color="success"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ValidRoles, type IUser } from '@/classes/models/ModelUser';
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
