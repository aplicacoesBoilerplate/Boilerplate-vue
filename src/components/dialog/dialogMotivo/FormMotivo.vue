<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense>
            <v-col cols="12" md="6">
                <InputUpperCase v-model:="motivo.descricaoMotivo" :style="{
                inputVariant: 'outlined',
                label: 'Descrição motivo',
                maxWidth: 650,
                counter: 100,
                }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
                <v-autocomplete clearable v-model="motivo.idCategoria" label="Categoria*" :items="categorias"
                :item-title="'descricaoCategoria'" :item-value="'idCategoria'" :rules="[rules.required]"
                variant="outlined" />
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
// Components
import InputUpperCase from '@/components/InputUpperCase.vue';

// Models
import type { CategoriasMotivos, MotivoConsulta } from '@/models/motivosModels/MotivosModels';

// Utils
import { rules } from '@/utils/rules';

// Vue
import { ref } from 'vue';

defineProps<{
    isEditing: boolean;
    categorias: CategoriasMotivos[]
}>();

const motivo = defineModel<MotivoConsulta>('motivo', { required: true });

const formRef = ref<any>(null);
const formIsValid = ref(false);

const validate = async (): Promise<boolean> => {
    const { valid } = await formRef.value?.validate();
    return valid;
};

defineExpose({
    validate,
    formIsValid
});

</script>
