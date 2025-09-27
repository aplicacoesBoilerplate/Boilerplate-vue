<template>
    <v-form ref="formRef" v-model="formIsValid">
        <v-row dense>
            <!-- Parâmetro que será usado para consultar as informações do funcionário que irá sair -->
            <v-col cols="12" md="6" class="d-flex justify-center">
                <v-number-input clearable v-model="saida.numeroRegistroFuncionario" :reverse="false"
                    :rules="[rules.required]" controlVariant="stacked" label="N° de Registro do Funcionário*"
                    :hideInput="false" inset :disabled="visualizando" variant="outlined">
                    <template #prepend-inner>
                        <div>
                            <v-btn icon variant="text" size="small" title="Buscar funcionario"
                                @click="consultarRegistroDP(saida.numeroRegistroFuncionario)">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </div>
                    </template>
                </v-number-input>
            </v-col>

            <!-- Código do motivo -->
            <v-col cols="12" md="6" class="d-flex justify-center">
                <v-autocomplete clearable v-model="saida.motivoSaida" label="Motivo*"
                    :items="apiMotivos?.registros" :item-title="'descricaoMotivo'" :item-value="'idMotivo'"
                    :rules="[rules.required]" :disabled="visualizando" variant="outlined" />
            </v-col>

            <!-- Informação retornada pela consulta -->
            <v-col cols="12" md="6" class="d-flex justify-center">
                <InputUpperCase v-model:="saida.nomeFuncionario" :style="{
                    inputDisabled: true,
                    inputVariant: 'outlined',
                    label: 'Nome do funcionário',
                    maxWidth: 650,
                    showLoading: showLoadingRegistro,
                }" />
            </v-col>

            <!-- Informação retornada pela consulta -->
            <v-col cols="12" md="6" class="d-flex justify-center">
                <InputUpperCase v-model:="saida.setorFuncionario" :style="{
                    inputDisabled: true,
                    inputVariant: 'outlined',
                    label: 'Setor do funcionário',
                    maxWidth: 650,
                    showLoading: showLoadingRegistro,
                }" />
            </v-col>

            <!-- Data e hora de previsão de saída do funcionário -->
            <v-col cols="12" md="6" class="d-flex justify-center">
                <DateTimePicker v-model="saida.dataPrevisaoSaidaFuncionario" label="Previsão da saída"
                    :disabled="visualizando" variant="outlined" />
            </v-col>

            <!-- Data e hora de previsão de retorno do funcionário -->
            <v-col cols="12" md="6" class="d-flex justify-center">
                <DateTimePicker v-model="saida.dataPrevisaoChegadaFuncionario" label="Previsão de retorno"
                    :disabled="visualizando" variant="outlined" />
            </v-col>

            <!-- Campo de observação da saída -->
            <v-col cols="12">
                <InputTextUpperCase v-model:="saida.observacaoSaida" :style="{
                    density: 'compact',
                    inputDisabled: visualizando,
                    inputVariant: 'outlined',
                    label: 'Observação da saída',
                    hideDetails: false,
                    counter: true,
                    maxWidth: 650,
                }" />
            </v-col>

            <!-- Usuário responsável por emitir a saída -->
            <v-col cols="6" class="d-flex justify-center" v-if="visualizando">
                <InputUpperCase v-model:="saida.statusSaida" :style="{
                    inputDisabled: true,
                    inputVariant: 'outlined',
                    label: 'Status saída:',
                    maxWidth: 650,
                }" />
            </v-col>

            <v-col cols="6" class="d-flex justify-center" v-if="visualizando">
                <InputUpperCase v-model:="saida.nomeFuncionarioResponsavelSaida" :style="{
                    inputDisabled: true,
                    inputVariant: 'outlined',
                    label: 'Emitida por:',
                    maxWidth: 650,
                }" />
            </v-col>
        </v-row>
    </v-form>

    <DialogRegistroDP v-model:dialog-registros="dialogRegistros" @selecionado="getValuesRegistroDP()" />
</template>

<script setup lang="ts">
// Components
import DateTimePicker from '@/components/DateTimePicker.vue'; // Componente visual para data e hora
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
import InputTextUpperCase from '@/components/InputTextUpperCase.vue'; // Componente visual para o input text area upper case
import DialogRegistroDP from '@/components/dialog/dialogSaidas/dialogRegistroDP/DialogRegistroDP.vue'; // Componente visual para a busca de funcionários

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator'
import { DialogRegistroDPClass } from './dialogRegistroDP/ClassDialogRegistroDP';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'

// Models
import type { SaidaConsulta } from '@/models/saidasModels/saidasModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels'

// Services
import { motivosServices } from '@/services/motivosServices'
import { firebirdServices } from '@/services/firebirdService';

// Utils
import { rules } from '@/utils/rules'

// Vue
import { onMounted, ref } from 'vue';

const formRef = ref()
const formIsValid = ref(false)
const showLoadingRegistro = ref(false)
const dialogRegistros = ref(new DialogRegistroDPClass())
const paginadorClass = ref(new PaginatorClass({
    limite: 10,
    offset: 1,
    totalPaginas: 0,
    totalRegistros: 0,
    orderBy: 'DESC',
    search: ''
})) // Classe para a paginação

defineProps<{
    isEditing: boolean;
    visualizando?: boolean | false
}>();

const saida = defineModel<SaidaConsulta>('saida', { required: true });

onMounted(async () => {
    await getAllMotivos()
})

// Consulta todos os motivos para alimentar o autocomplete
var apiMotivos = ref<HeaderPaginatorModel<MotivoConsulta>>()
async function getAllMotivos() {
    try {
        const response = await motivosServices.getMotivos(paginadorClass.value)
        apiMotivos.value = response

    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
        throw error
    }
}

async function consultarRegistroDP(codRegistro?: number) {
    try {
        showLoadingRegistro.value = true
        if (codRegistro) {
            const search = codRegistro.toString()
            const response = await firebirdServices.getRegistroDP(search)
            if (response) {
                saida.value.numeroRegistroFuncionario = response[0].registroDP
                saida.value.nomeFuncionario = response[0].nome
                saida.value.setorFuncionario = response[0].descricaoSetor
            }
        } else {
            dialogRegistros.value.openDialog()
        }
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
    } finally {
        showLoadingRegistro.value = false
    }
}

function getValuesRegistroDP() {
    const valuesRegistro = dialogRegistros.value.getValues()

    if (valuesRegistro.registroDP > 0) {
        saida.value.numeroRegistroFuncionario = valuesRegistro.registroDP
        saida.value.nomeFuncionario = valuesRegistro.nome
        saida.value.setorFuncionario = valuesRegistro.descricaoSetor
    }
}

const validate = async (): Promise<boolean> => {
    const { valid } = await formRef.value?.validate();
    return valid;
};

defineExpose({
    validate,
    formIsValid
});

</script>
