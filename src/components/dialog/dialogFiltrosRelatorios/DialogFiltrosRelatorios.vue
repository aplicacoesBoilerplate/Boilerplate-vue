<template>
    <v-overlay :model-value="loadingRelatorio" class="d-flex align-center justify-center" persistent scrim
        z-index="9999">
        <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>

    <BaseDialog v-model:atributos="dialogState">
        <template #titulo>
            <v-icon>mdi-chart-box-multiple-outline</v-icon>
            {{ `Filtros para gerar relatório: ${montarFiltros.relatorio.tipoRelatorio} -
            ${montarFiltros.relatorio.modeloRelatorio}` }}
        </template>

        <template #default>
            <v-tabs v-model="tab" bg-color="primary" @update:modelValue="getCamposTabela(tab)">
                <v-tab value="instrucoes">Instruções</v-tab>
                <v-tab v-for="aba in abasPorTabela" :key="aba" :value="aba">
                    {{ aba }}
                </v-tab>
                <v-tab value="filtros">Filtros aplicados</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="instrucoes">
                    <p class="text-info text-h6 mt-2 mb-3">
                        <strong><em>
                            Navegue entre as abas acima, selecione os filtros desejados para montar o seu relatório!
                        </em></strong>
                    </p>
                    <p>
                        Os filtros são compostos por um campo, cada um dos campos tem possíveis condições,
                        a depender da condição, o valor consultado pode ser diferente, variando entre um valor
                        único, um intervalo ou até mesmo uma data.
                    </p>
                </v-tabs-window-item>

                <v-tabs-window-item v-for="aba in abasPorTabela" :key="aba" :value="aba" />

                <v-tabs-window-item eager value="filtros">
                    <v-card prepend-icon="" max-height="500" class="pa-2">
                        <v-card-text style="max-height: 450px; overflow-y: auto;">
                            <!-- Exibição dos filtros aplicados ao relatório -->
                            <v-row dense v-for="(filtro, index) in montarFiltros.getFiltrosAplicados()"
                                :key="`${filtro.tabela}-${filtro.campoTabela}-${index}`">
                                <v-col cols="1">
                                    <v-icon>mdi-filter-outline</v-icon>
                                </v-col>
                                <v-col cols="2">
                                    TABELA: <br> {{ filtro.tabela }}
                                </v-col>
                                <v-col cols="3">
                                    CAMPO: <br> {{ filtro.campoTabela }}
                                </v-col>
                                <v-col cols="3">
                                    CONDIÇÃO: <br> {{ filtro.condicao }}
                                </v-col>
                                <v-col cols="2" v-if="filtro.condicao == 'INTERVALO'">
                                    ENTRE: <br> {{ filtro.intervaloRegistros[0] }} - {{ filtro.intervaloRegistros[1]}}
                                </v-col>
                                <v-col cols="2" v-else>
                                    VALOR: <br> {{ filtro.searchRegistro }}
                                </v-col>
                                <!-- Botão para remover um filtro -->
                                <v-col cols="1">
                                    <div>
                                        <BtnOpenDialog :callback="() => removerFiltro(index)" size="small"
                                            variant="elevated" color="red-lighten-1" icon="mdi-window-close"
                                            title="Remover filtro" />
                                    </div>
                                </v-col>

                                <v-divider />
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-tabs-window-item>
            </v-tabs-window>

            <div v-if="tab !== 'instrucoes' && tab !== 'filtros'">
                <FormFiltrosRelatorio
                    ref="formComponentRef"
                    v-model:filtro="formFiltro" v-model:condicoes="condicoesAutoComplete"
                    :tab="tab"
                    :camposPorTabela="camposPorTabela"
                >
                    <template #outrasAcoes>
                        <v-col cols="12">
                            <v-btn v-if="isEditing"
                                @click="cancelarEdicao()" label="Cancelar edição do filtro"
                                variant="tonal" color="red-lighten-1" class="w-50">
                                <v-icon>mdi-close</v-icon>
                                Cancelar
                            </v-btn>

                            <v-btn
                                :disabled="!formComponentRef?.formIsValid" @click="submitFormFiltro"
                                label="Adicionar filtro" variant="tonal" color="success"
                                :class="isEditing ? 'w-50' : 'w-100'">
                                <v-icon>mdi-plus-circle-outline</v-icon>
                                Adicionar filtro
                            </v-btn>
                        </v-col>
                    </template>
                </FormFiltrosRelatorio>

                <v-virtual-scroll :items="filtrarFiltrosAplicadosPorTabela()" max-height="250" item-height="50">
                    <template v-slot:default="{ item: filtro, index }">
                        <v-list-item :title="`${filtro.tabela}`">
                            <!-- Ícone de cartão de filtro -->
                            <template v-slot:prepend>
                                <v-icon>mdi-filter-outline</v-icon>
                            </template>

                            <v-row>
                                <v-col cols="4">
                                    CAMPO: <br> {{ filtro.campoTabela }}
                                </v-col>
                                <v-col cols="3">
                                    CONDIÇÃO: <br> {{ filtro.condicao }}
                                </v-col>
                                <v-col cols="3" v-if="filtro.condicao == 'INTERVALO'">
                                    ENTRE: <br> {{ filtro.intervaloRegistros[0] }} - {{
                                        filtro.intervaloRegistros[1] }}
                                </v-col>
                                <v-col cols="3" v-else>
                                    VALOR: <br> {{ filtro.searchRegistro }}
                                </v-col>
                                <!-- Botão para editar um filtro -->
                                <v-col cols="1">
                                    <div>
                                        <v-btn @click="editarFiltro(index)" size="small" color="info"
                                            variant="elevated" icon="mdi-pencil-outline"
                                            title="Editar filtro" />
                                    </div>
                                </v-col>
                                <!-- Botão para remover um filtro -->
                                <v-col cols="1">
                                    <div>
                                        <BtnOpenDialog :callback="() => removerFiltro(index)" size="small"
                                            variant="elevated" color="red-lighten-1" icon="mdi-window-close"
                                            title="Remover filtro" />
                                    </div>
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-divider />
                    </template>
                </v-virtual-scroll>
            </div>
        </template>

        <template #acoes>
            <v-btn color="warning" variant="plain" @click="clearFields()">
                <v-icon class="pt-1">mdi-refresh</v-icon>
                Limpar todos os filtros
            </v-btn>
            <v-spacer />

            <v-btn color="red" variant="plain" @click="resetForm()">
                <v-icon class="pt-1">mdi-close</v-icon>
                Fechar
            </v-btn>

            <!-- Botão para gerar um relatório -->
            <v-btn color="success" variant="tonal" @click="gerarRelatorio()">
                <v-icon class="pt-1">mdi-check</v-icon>
                Gerar relatório
            </v-btn>
        </template>
    </BaseDialog>

    <DialogExibirRelatorioGerado ref="dialogExibirRelatorioGeradoRef" v-model:relatorio-gerado="relatorioGerado" />
</template>

<script setup lang="ts">
// Componentes
import BaseDialog from '../BaseDialog.vue';
import FormFiltrosRelatorio from './FormFiltrosRelatorio.vue';
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue";
import DialogExibirRelatorioGerado from './dialogExibirRelatorioGerado/DialogExibirRelatorioGerado.vue';

// Classes
import type { DialogFiltrosRelatoriosClass } from "@/components/dialog/dialogFiltrosRelatorios/ClassDialogFiltrosRelatorios.ts";

// Models
import { CondicoesFiltrosAutoComplete, type AutoCompleteCondicoes, type FiltrosDoRelatorio, type ParametrosGerarRelatorio, type PossiveisFiltrosDoCampo, type RelatorioGerado } from "@/models/relatoriosModels/relatoriosModels.ts";

// Services
import { relatoriosServices } from "@/services/relatoriosService.ts";
import { useSnackbarStore } from "@/stores/SnackbarStore";

// Vue
import { computed, nextTick, onBeforeMount, ref, toRaw, watch } from "vue";

const tab = ref() // Controle das tabs

const tipoInputConsulta = ref('') // Variável para armazenar o tipo do input que deve ser usado
const condicoesAutoComplete = ref<AutoCompleteCondicoes[]>([]) // Lista de possíveis condições para cada campo

const formFiltro = ref<FiltrosDoRelatorio>({} as FiltrosDoRelatorio) // Objeto gerado pelo form
const filtrosAplicados = ref<FiltrosDoRelatorio[]>([])

const isEditing = ref(false) // Controla que o filtro está em edição
const editingIndex = ref<number | null>(null) // Qual o indice da lista de filtros está em edição

const loadingRelatorio = ref(false) // Loading de geração de relatório

const formComponentRef = ref<InstanceType<typeof FormFiltrosRelatorio> | null>(null);

const montarFiltros = defineModel<DialogFiltrosRelatoriosClass>('montarFiltros', { required: true })
const dialogState = computed({
    get: () => ({
        visualizar: montarFiltros.value.show,
        maxWidth: 1100,
    }),
    set: (newValue) => {
        montarFiltros.value.show = newValue.visualizar;
    }
});

//#region funcionalidades do vue

onBeforeMount(async () => {
    await getTabelasRelacionadas(); // Pegar todas as tabelas relacionadas com o relatório e exibir as mesmas para o usuário
})

watch(() => formFiltro.value.campoTabela, async (val) => { // Sempre que o campo for alterado a lista de condições também deve ser alterada
    if (val) {
        // Limpa os dados atuais após a mudança
        formFiltro.value.condicao = null
        formFiltro.value.searchRegistro = ''
        formFiltro.value.intervaloRegistros = []

        // Abaixo a funcionalidade extrai todas as opções compativeis com a resposta da API
        try {
            const camposDaTabela = await relatoriosServices.getCamposTabela(tab.value);
            const campoSelecionado = camposDaTabela.find(c => c.valor === val);

            if (campoSelecionado) {
                const condicoesPermitidas = campoSelecionado.condicoes;
                condicoesAutoComplete.value = CondicoesFiltrosAutoComplete.filter(item =>
                    condicoesPermitidas.includes(item.valor)
                );
            }
        } catch (error) {
            useSnackbarStore().showSnackbar(error, 'red')
        }
    }
});

watch(() => formFiltro.value.condicao, async (val) => { // Se a condição for alterada, limpar os campos que antes estavam sendo usados para não resultar em conflito nas variáveis
    formFiltro.value.searchRegistro = ''
    formFiltro.value.intervaloRegistros = []

    // Abaixo apenas iremos pegar qual é o tipo do input com base nos atributos selecionados
    if (val) {
        try {
            const response = await relatoriosServices.getCamposTabela(tab.value, formFiltro.value.campoTabela);
            tipoInputConsulta.value = response[0].tipo
        } catch (error) {
            useSnackbarStore().showSnackbar(error, 'red')
        }
    }
})

watch(() => tab.value, (val) => { // Sempre que a aba dos filtros for alterada, deve limpar o formulário
    if (val) {
        formFiltro.value = {} as FiltrosDoRelatorio
        filtrosAplicados.value = filtrarFiltrosAplicadosPorTabela();
    }

    if (tab.value == 'filtros')
        filtrosAplicados.value = montarFiltros.value.getFiltrosAplicados();
})

watch(() => montarFiltros.value.show, (isOpen) => {
    if (!isOpen) {
        resetForm()
    }
});

defineExpose({ getTabelasRelacionadas })

//#endregion

function clearFields() {
    formFiltro.value = {} as FiltrosDoRelatorio
    montarFiltros.value.clearFields()
}

function closeDialog() {
    montarFiltros.value.closeDialog()
}

function resetForm() {
    closeDialog()
    tab.value = 'instrucoes'
    formFiltro.value.campoTabela = ''
    condicoesAutoComplete.value = []
}

function submitFormFiltro() {
    try {
        if (tipoInputConsulta.value == 'INTEIRO' && formFiltro.value.condicao != 'INTERVALO') {
            const isEmpty = !formFiltro.value.searchRegistro || formFiltro.value.searchRegistro.trim() === ''
            const isNotNumeric = isNaN(Number(formFiltro.value.searchRegistro))

            if (isEmpty || isNotNumeric) {
                throw new Error('Informe um valor numérico válido para o filtro.')
            }

            if (formFiltro.value.searchRegistro)
                formFiltro.value.searchRegistro = formFiltro.value.searchRegistro.replace(/\D/g, '')
        }

        if (tipoInputConsulta.value == 'INTEIRO' && formFiltro.value.condicao == 'INTERVALO') {
            const isEmpty0 = !formFiltro.value.intervaloRegistros[0] || formFiltro.value.intervaloRegistros[0].trim() === ''
            const isEmpty1 = !formFiltro.value.intervaloRegistros[1] || formFiltro.value.intervaloRegistros[1].trim() === ''
            const isNotNumeric0 = isNaN(Number(formFiltro.value.intervaloRegistros[0]))
            const isNotNumeric1 = isNaN(Number(formFiltro.value.intervaloRegistros[1]))

            if (isEmpty0 || isEmpty1 || isNotNumeric0 || isNotNumeric1) {
                throw new Error('Informe um valor numérico válido para o filtro.')
            }

            if (formFiltro.value.intervaloRegistros[0])
                formFiltro.value.intervaloRegistros[0] = formFiltro.value.intervaloRegistros[0].replace(/\D/g, '')

            if (formFiltro.value.intervaloRegistros[1])
                formFiltro.value.intervaloRegistros[1] = formFiltro.value.intervaloRegistros[1].replace(/\D/g, '')
        }

        adicionarOuEditarFiltro(formFiltro.value);
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red');
    }
}

function adicionarOuEditarFiltro(novoFiltro: FiltrosDoRelatorio) {
    novoFiltro.tabela = tab.value;

    const novaChave = gerarChaveFiltro(novoFiltro);

    const isDuplicado = filtrosAplicados.value.some((f, index) => {
        const chave = gerarChaveFiltro(f)
        return chave === novaChave && index !== editingIndex.value
    });

    if (isDuplicado) {
        useSnackbarStore().showSnackbar('Esse filtro já foi adicionado!', 'red');
        throw new Error('Filtro duplicado!');
    }

    if (isEditing.value && editingIndex.value !== null) {
        montarFiltros.value.setOrEditingFiltro(novoFiltro, editingIndex.value);
    } else {
        montarFiltros.value.setOrEditingFiltro(novoFiltro);
    }

    filtrosAplicados.value = filtrarFiltrosAplicadosPorTabela();

    limparFiltro();
}

async function editarFiltro(index: number) {
    const filtroParaEditar = filtrosAplicados.value[index]

    const originalIndex = montarFiltros.value.filtros.findIndex(filtro =>
        gerarChaveFiltro(filtro) === gerarChaveFiltro(filtroParaEditar)
    );

    isEditing.value = true
    editingIndex.value = originalIndex
    formFiltro.value = { ...toRaw(filtroParaEditar) };
}

function gerarChaveFiltro(filtro: FiltrosDoRelatorio): string {
    if (!filtro || !filtro.tabela || !filtro.campoTabela || !filtro.condicao)
        return 'INVALIDO';

    if (filtro.condicao == 'SELECAO')
        return `${filtro.tabela}_${filtro.campoTabela}_${filtro.condicao}_${filtro.searchRegistro}`
    else
        return `${filtro.tabela}_${filtro.campoTabela}_${filtro.condicao}`
}

function limparFiltro() {
    formFiltro.value = {} as FiltrosDoRelatorio
    isEditing.value = false
    editingIndex.value = null
}

function cancelarEdicao() {
    limparFiltro()
}

function filtrarFiltrosAplicadosPorTabela() {
    return montarFiltros.value.filtrarFiltrosAplicadosPorTabela(tab.value)
}

function removerFiltro(index: number) {
    montarFiltros.value.removeFiltro(index)
}

//#region populando o componente

const abasPorTabela = ref<string[]>() // Acredito que pode chamar a função no template
async function getTabelasRelacionadas() { // Método chamado ao iniciar a exibição no template
    try {
        const response = await relatoriosServices.getTabelasRelacionadas(montarFiltros.value.relatorio.modeloRelatorio);
        abasPorTabela.value = response
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
    }
}

const camposPorTabela = ref<PossiveisFiltrosDoCampo[]>() // Acredito que possa ser chamado pelo template
async function getCamposTabela(tabela: string, campo?: string) { // Duas possibilidades de resposta, responsabilidade para a classe
    if (!tabela || tabela === 'instrucoes' || tabela === 'filtros') return;

    try {
        const response = await relatoriosServices.getCamposTabela(tabela, campo);
        camposPorTabela.value = response
    } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
    }
}

//#endregion

const dialogExibirRelatorioGeradoRef = ref()
const relatorioGerado = ref<RelatorioGerado>({
    modeloRelatorio: '',
    tipoRelatorio: ''
})

async function gerarRelatorio() {
    try {
        loadingRelatorio.value = true;

        const parametros = ref<ParametrosGerarRelatorio>({
            modeloRelatorio: '',
            tipoRelatorio: '',
            filtrosPorCampo: []
        })

        parametros.value.modeloRelatorio = montarFiltros.value.relatorio.modeloRelatorio ?? ''
        parametros.value.tipoRelatorio = montarFiltros.value.relatorio.tipoRelatorio ?? ''
        parametros.value.filtrosPorCampo = montarFiltros.value.filtros ?? []

        relatorioGerado.value = await relatoriosServices.gerarRelatorio(parametros.value)

        nextTick(() => {
            dialogExibirRelatorioGeradoRef.value?.openDialog()
        })
    } catch (error) {
        useSnackbarStore().showSnackbar("Erro ao gerar relatório! " + error, "red");
    } finally {
        loadingRelatorio.value = false;
    }
}

</script>
