<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense>
            <v-col cols="12">
              <InputUpperCase v-model:="categoria.descricaoCategoria" :style="{
                inputVariant: 'outlined',
                label: 'Descrição categoria *',
                maxWidth: 650,
                counter: 100,
              }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="6" class="d-flex justify-center">
              <v-checkbox v-model="categoria.emergencial" color="red" label="Emergencial?" hide-details />
            </v-col>

            <v-col cols="6" class="d-flex justify-center">
              <v-checkbox v-model="categoria.abaterHoraExtra" color="warning" label="Abater hora extra?" hide-details />
            </v-col>
          </v-row>
    </v-form>
</template>

<script setup lang="ts">
// Components
import InputUpperCase from '@/components/InputUpperCase.vue';

// Models
import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels';

// Utils
import { rules } from '@/utils/rules';

// Vue
import { ref } from 'vue';

defineProps<{
    isEditing: boolean;
}>();

const categoria = defineModel<CategoriasMotivos>('categoria', { required: true });

const formRef = ref<any>(null);
const formIsValid = ref(false);

const validate = async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
};

defineExpose({
    validate,
    formIsValid
});

</script>
