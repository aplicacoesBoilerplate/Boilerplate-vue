<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense>
            <v-col cols="12">
                <InputTextUpperCase v-model:="autorizacao.observacaoAutorizacao" :style="{
                    density: 'compact',
                    inputVariant: 'outlined',
                    label: 'Observação',
                    hideDetails: false,
                    counter: true,
                    maxWidth: 650,
                }"
                    :rules="[rules.requiredCondicionado(() => !autorizacao.aprovacaoSaida, 'Obrigatório se a saída não for autorizada')]" />
            </v-col>
        </v-row>
    </v-form>

</template>
<script setup lang="ts">
// Components
import InputTextUpperCase from '@/components/InputTextUpperCase.vue';
import type { AutorizacoesConsulta } from '@/models/saidasModels/saidasModels';

// Utils
import { rules } from '@/utils/rules'

// Vue
import { ref } from 'vue';

const autorizacao = defineModel<AutorizacoesConsulta>('autorizacao', { required: true });

const formRef = ref()
const formIsValid = ref(false)

const validate = async () => {
    const { isValid } = await formRef.value?.validate();
    return isValid;
};

defineExpose({
    validate,
    formIsValid
});

</script>
