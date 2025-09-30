<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense class="mt-4">
            <v-col cols="12" md="6" class="d-flex justify-center">
                <v-autocomplete clearable v-model="filtro.campoTabela" label="Campo*"
                    :items="camposPorTabela" :item-title="'chave'" :item-value="'valor'"
                    :rules="[rules.required]" variant="outlined">
                </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
                <v-autocomplete clearable v-model="filtro.condicao" label="Condição*"
                    :items="condicoes" :item-title="'chave'" :item-value="'valor'"
                    :rules="[rules.required]" variant="outlined"
                    :disabled="filtro.campoTabela == null || filtro.campoTabela == ''">

                    <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                            <template #prepend>
                                <v-icon>{{ item.raw.icon }}</v-icon>
                            </template>
                        </v-list-item>
                    </template>

                    <template v-slot:selection="{ item }">
                        <v-icon start>{{ item.raw.icon }}</v-icon>
                        <span>{{ item.title }}</span>
                    </template>
                </v-autocomplete>
            </v-col>

            <!-- Input para tipo STRING -->
            <v-col cols="12" v-if="tipoInputConsulta == 'STRING' && filtro.condicao != null">
                <InputUpperCase v-model:="filtro.searchRegistro" :style="{
                    inputVariant: 'outlined',
                    label: 'buscar valor*',
                    maxWidth: 1100,
                    hint: 'Campo de texto para consulta',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required, rules.max]" />
            </v-col>

            <!-- Input para tipo INTEIRO ÚNICO -->
            <v-col cols="12"
                v-if="tipoInputConsulta == 'INTEIRO' && (filtro.condicao != 'INTERVALO' && filtro.condicao != null)">
                <InputUpperCase v-model:="filtro.searchRegistro" v-numeric-mask :style="{
                    inputVariant: 'outlined',
                    label: 'Buscar valor*',
                    maxWidth: 1100,
                    hint: 'Campo numérico para consulta',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required, rules.max]" />
            </v-col>

            <!-- Input para tipo INTEIRO INTERVALO -->
            <v-col cols="12" md="6"
                v-if="tipoInputConsulta == 'INTEIRO' && filtro.condicao == 'INTERVALO'">
                <InputUpperCase v-model:="filtro.intervaloRegistros[0]" v-numeric-mask :style="{
                    inputVariant: 'outlined',
                    label: 'Buscar intervalo de valores - início*',
                    maxWidth: 1100,
                    hint: 'Campo numérico para consulta',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="12" md="6"
                v-if="tipoInputConsulta == 'INTEIRO' && filtro.condicao == 'INTERVALO'">
                <InputUpperCase v-model:="filtro.intervaloRegistros[1]" v-numeric-mask :style="{
                    inputVariant: 'outlined',
                    label: 'Buscar intervalo de valores - fim*',
                    maxWidth: 1100,
                    hint: 'Campo numérico para consulta',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required, rules.max]" />
            </v-col>

            <!-- Input para tipo BOOLEAN não tem necessidade, a condição já é o suficiente -->

            <!-- Input para tipo DATA ÚNICO -->
            <v-col cols="12"
                v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && (filtro.condicao != 'INTERVALO' && filtro.condicao != null)">
                <InputUpperCase v-model:="filtro.searchRegistro" v-data-mask :style="{
                    inputVariant: 'outlined',
                    label: 'Buscar pela data*',
                    maxWidth: 1100,
                    hint: 'Campo de data para consulta (DD/MM/YYYY)',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required]" />
            </v-col>

            <!-- Inputs para tipo DATA em um INTERVALO -->
            <v-col cols="12" md="6"
                v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && filtro.condicao == 'INTERVALO'">
                <InputUpperCase v-model:="filtro.intervaloRegistros[0]" v-data-mask :style="{
                    inputVariant: 'outlined',
                    label: 'Buscar intervalo de data - início*',
                    maxWidth: 1100,
                    hint: 'Campo de data para consulta (DD/MM/YYYY)',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required]" />
            </v-col>

            <v-col cols="12" md="6"
                v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && filtro.condicao == 'INTERVALO'">
                <InputUpperCase v-model:="filtro.intervaloRegistros[1]" v-data-mask :style="{
                    inputVariant: 'outlined',
                    label: 'Buscar intervalo de data - fim*',
                    maxWidth: 1100,
                    hint: 'Campo de data para consulta (DD/MM/YYYY)',
                    counter: 100,
                    inputDisabled: filtro.condicao == null
                }" :rules="[rules.required]" />
            </v-col>

            <slot name="outrasAcoes"></slot>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
// Components
import InputUpperCase from '@/components/InputUpperCase.vue';

// Models
import { CondicoesFiltrosAutoComplete, type AutoCompleteCondicoes, type FiltrosDoRelatorio, type PossiveisFiltrosDoCampo } from '@/models/relatoriosModels/relatoriosModels';

// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Services
import { relatoriosServices } from "@/services/relatoriosService.ts";

// Utils
import { rules } from "@/utils/rules.ts";

// Vue
import { ref, watch } from 'vue';

const props = defineProps<{
    tab: string;
    camposPorTabela: PossiveisFiltrosDoCampo[] | undefined;
}>();

const tipoInputConsulta = ref()
const condicoes = defineModel<Array<AutoCompleteCondicoes>>('condicoes', { required: true })
const filtro = defineModel<FiltrosDoRelatorio>('filtro', { required: true });

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

watch(() => props.tab, (val) => { // Sempre que a aba dos filtros for alterada, deve limpar o formulário
    if (val) {
        filtro.value = {} as FiltrosDoRelatorio
    }
})

watch(() => filtro.value.campoTabela, async (val) => { // Sempre que o campo for alterado a lista de condições também deve ser alterada
    if (val) {
        // Limpa os dados atuais após a mudança
        filtro.value.condicao = null
        filtro.value.searchRegistro = ''
        filtro.value.intervaloRegistros = []

        // Abaixo a funcionalidade extrai todas as opções compativeis com a resposta da API
        try {
            const camposDaTabela = await relatoriosServices.getCamposTabela(props.tab);
            const campoSelecionado = camposDaTabela.find(c => c.valor === val);

            if (campoSelecionado) {
                const condicoesPermitidas = campoSelecionado.condicoes;
                condicoes.value = CondicoesFiltrosAutoComplete.filter(item =>
                    condicoesPermitidas.includes(item.valor)
                );
            }
        } catch (error) {
            useSnackbarStore().showSnackbar(error, 'red')
        }
    }
});

watch(() => filtro.value.condicao, async (val) => { // Se a condição for alterada, limpar os campos que antes estavam sendo usados para não resultar em conflito nas variáveis
    filtro.value.searchRegistro = ''
    filtro.value.intervaloRegistros = []

    // Abaixo apenas iremos pegar qual é o tipo do input com base nos atributos selecionados
    if (val) {
        try {
            const response = await relatoriosServices.getCamposTabela(props.tab, filtro.value.campoTabela);
            tipoInputConsulta.value = response[0].tipo
        } catch (error) {
            useSnackbarStore().showSnackbar(error, 'red')
        }
    }
})

</script>
