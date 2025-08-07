<template>
  <v-overlay
    :model-value="loadingRelatorio"
    class="d-flex align-center justify-center"
    persistent
    scrim
    z-index="9999"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </v-overlay>

  <v-dialog v-model="montarFiltros.show" max-width="1100" max-height="800">

    <v-card prepend-icon=""
      :title="montarFiltros.show ? `Filtros para gerar relatório: ${montarFiltros.relatorio.tipoRelatorio} - ${montarFiltros.relatorio.modeloRelatorio}` : ''">
      <v-tabs v-model="tab" bg-color="primary" @update:modelValue="getCamposTabela(tab)">
        <v-tab value="instrucoes">Instruções</v-tab>
        <v-tab v-for="aba in abasPorTabela" :key="aba" :value="aba">
          {{ aba }}
        </v-tab>
        <v-tab value="filtros">Filtros aplicados</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="instrucoes">
            <p class="text-info">
              Navegue entre as abas acima, selecione os filtros desejados para montar o seu relatório!
            </p>
            <p>
              Os filtros são compostos por um campo, cada um dos campos tem possíveis condições,
              a depender da condição, o valor consultado pode ser diferente, variando entre um valor único,
              um intervalo ou até mesmo uma data.
            </p>
          </v-tabs-window-item>

          <div v-for="aba in abasPorTabela" :key="aba">
            <v-tabs-window-item :value="aba">
              <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitFormFiltro()">
                <v-row dense class="mt-4">
                  <v-col cols="12" md="6" class="d-flex justify-center">
                    <v-autocomplete clearable v-model="filtro.campoTabela" label="Campo*" :items="camposPorTabela"
                      :item-title="'chave'" :item-value="'valor'" :rules="[rules.required]" variant="outlined">
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="6" class="d-flex justify-center">
                    <v-autocomplete clearable v-model="filtro.condicao" label="Condição*" :items="condicoesAutoComplete"
                      :item-title="'chave'" :item-value="'valor'" :rules="[rules.required]" variant="outlined"
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
                      label: 'Valor',
                      maxWidth: 1100,
                      hint: 'Campo de texto para consulta',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                      tipoInputConsulta == 'STRING'
                      && (filtro.searchRegistro == null || filtro.searchRegistro == '')
                    ), rules.max
                    ]" />
                  </v-col>

                  <!-- Input para tipo INTEIRO ÚNICO -->
                  <v-col cols="12"
                    v-if="tipoInputConsulta == 'INTEIRO' && (filtro.condicao != 'INTERVALO' && filtro.condicao != null)">
                    <InputUpperCase v-model:="filtro.searchRegistro" v-numeric-mask :style="{
                      inputVariant: 'outlined',
                      label: 'Valor',
                      maxWidth: 1100,
                      hint: 'Campo numérico para consulta',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                        tipoInputConsulta == 'INTEIRO'
                        && (filtro.searchRegistro == null || filtro.searchRegistro == '')
                      ), rules.max
                      ]" />
                  </v-col>

                  <!-- Input para tipo INTEIRO INTERVALO -->
                  <v-col cols="12" md="6" v-if="tipoInputConsulta == 'INTEIRO' && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[0]" v-numeric-mask :style="{
                      inputVariant: 'outlined',
                      label: 'Valor início',
                      maxWidth: 1100,
                      hint: 'Campo numérico para consulta',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                        tipoInputConsulta == 'INTEIRO'
                        && filtro.condicao == 'INTERVALO'
                        && (filtro.intervaloRegistros[0] == null || filtro.intervaloRegistros[0] == '')
                      ), rules.max
                      ]" />
                  </v-col>

                  <v-col cols="12" md="6" v-if="tipoInputConsulta == 'INTEIRO' && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[1]" v-numeric-mask :style="{
                      inputVariant: 'outlined',
                      label: 'Valor fim',
                      maxWidth: 1100,
                      hint: 'Campo numérico para consulta',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                        tipoInputConsulta == 'INTEIRO'
                        && filtro.condicao == 'INTERVALO'
                        && (filtro.intervaloRegistros[1] == null || filtro.intervaloRegistros[1] == '')
                      ), rules.max
                      ]" />
                  </v-col>

                  <!-- Input para tipo BOOLEAN não tem necessidade, a condição já é o suficiente -->

                  <!-- Input para tipo DATA ÚNICO -->
                  <v-col cols="12"
                    v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && (filtro.condicao != 'INTERVALO' && filtro.condicao != null)">
                    <InputUpperCase v-model:="filtro.searchRegistro" v-data-mask :style="{
                      inputVariant: 'outlined',
                      label: 'Valor',
                      maxWidth: 1100,
                      hint: 'Campo de data para consulta (DD/MM/YYYY)',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                        (tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME')
                        && (filtro.searchRegistro == null || filtro.searchRegistro == '')
                      )
                      ]" />
                  </v-col>

                  <!-- Input para tipo DATA INTERVALO -->
                  <v-col cols="12" md="6"
                    v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[0]" v-data-mask :style="{
                      inputVariant: 'outlined',
                      label: 'Valor início',
                      maxWidth: 1100,
                      hint: 'Campo de data para consulta (DD/MM/YYYY)',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                        (tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME')
                        && filtro.condicao == 'INTERVALO'
                        && (filtro.intervaloRegistros[0] == null || filtro.intervaloRegistros[0] == '')
                      )
                      ]" />
                  </v-col>
                  <v-col cols="12" md="6"
                    v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[1]" v-data-mask :style="{
                      inputVariant: 'outlined',
                      label: 'Valor fim',
                      maxWidth: 1100,
                      hint: 'Campo de data para consulta (DD/MM/YYYY)',
                      counter: 100,
                      inputDisabled: filtro.condicao == null
                    }" :rules="[rules.requiredCondicionado(
                        (tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME')
                        && filtro.condicao == 'INTERVALO'
                        && (filtro.intervaloRegistros[1] == null || filtro.intervaloRegistros[1] == '')
                      )
                      ]" />
                  </v-col>

                  <v-col cols="12">
                    <!-- Botão para cancelar edição um filtro -->
                    <v-btn v-if="tab != 'instrucoes' && tab != 'filtros' && isEditing" @click="cancelarEdicao()"
                      title="Cancelar edição do filtro" label="Cancelar edição do filtro" variant="tonal"
                      color="red-lighten-1" class="w-50">
                      <v-icon>mdi-close</v-icon>
                      Cancelar
                    </v-btn>

                    <!-- Botão para adiconar um filtro -->
                    <v-btn v-if="tab != 'instrucoes' && tab != 'filtros'" :disabled="!formIsValid" type="submit"
                      title="Adicionar filtro" label="Adicionar filtro" variant="tonal" color="success"
                      :class="isEditing ? 'w-50' : 'w-100'">
                      <v-icon>mdi-plus-circle-outline</v-icon>
                      Adicionar filtro
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

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
                        ENTRE: <br> {{ filtro.intervaloRegistros[0] }} - {{ filtro.intervaloRegistros[1] }}
                      </v-col>
                      <v-col cols="3" v-else>
                        VALOR: <br> {{ filtro.searchRegistro }}
                      </v-col>
                      <!-- Botão para editar um filtro -->
                      <v-col cols="1">
                        <div>
                          <v-btn @click="editarFiltro(index)" size="small" color="info"
                            variant="elevated" icon="mdi-pencil-outline" title="Editar filtro" />
                        </div>
                      </v-col>
                      <!-- Botão para remover um filtro -->
                      <v-col cols="1">
                        <div>
                          <BtnOpenDialog :callback="() => removerFiltro(index)" size="small"
                            variant="elevated" color="red-lighten-1" icon="mdi-window-close" title="Remover filtro" />
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-divider />
                </template>
              </v-virtual-scroll>
            </v-tabs-window-item>
          </div>

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
                    ENTRE: <br> {{ filtro.intervaloRegistros[0] }} - {{ filtro.intervaloRegistros[1] }}
                  </v-col>
                  <v-col cols="2" v-else>
                    VALOR: <br> {{ filtro.searchRegistro }}
                  </v-col>
                  <!-- Botão para remover um filtro -->
                  <v-col cols="1">
                    <div>
                      <BtnOpenDialog :callback="() => removerFiltro(index)" size="small"
                        variant="elevated" color="red-lighten-1" icon="mdi-window-close" title="Remover filtro" />
                    </div>
                  </v-col>

                  <v-divider />
                </v-row>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" variant="plain" @click="clearFields()">
          <v-icon class="pt-1">mdi-refresh</v-icon>
          Limpar todos os filtros
        </v-btn>
        <v-spacer />

        <v-btn color="red" variant="plain" @click="cancelar()">
          <v-icon class="pt-1">mdi-close</v-icon>
          Fechar
        </v-btn>

        <!-- Botão para gerar um relatório -->
        <v-btn color="success" variant="tonal" @click="gerarRelatorio()">
          <v-icon class="pt-1">mdi-check</v-icon>
          Gerar relatório
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <DialogExibirRelatorioGerado ref="dialogExibirRelatorioGeradoRef" v-model:relatorio-gerado="relatorioGerado" />
</template>

<script setup lang="ts">
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue";

// Classes
import type { DialogFiltrosRelatoriosClass } from "@/components/dialog/dialogFiltrosRelatorios/ClassDialogFiltrosRelatorios.ts";

// Models
import { CondicoesFiltrosAutoComplete, type AautoCompleteCondicoes, type FiltrosDoRelatorio, type ParametrosGerarRelatorio, type PossiveisFiltrosDoCampo, type RelatorioGerado } from "@/models/relatoriosModels/relatoriosModels.ts";

// Services
import { relatoriosServices } from "@/services/relatoriosService.ts";
import { useSnackbarStore } from "@/stores/SnackbarStore";
import { rules } from "@/utils/rules.ts";

// Vue
import { nextTick, onBeforeMount, ref, toRaw, watch } from "vue";
import DialogExibirRelatorioGerado from './dialogExibirRelatorioGerado/DialogExibirRelatorioGerado.vue';

const tab = ref() // Controle das tabs
const formRef = ref() // Referência para o form
const formIsValid = ref(false) // Validação do form

const tipoInputConsulta = ref('') // Variável para armazenar o tipo do input que deve ser usado
const condicoesAutoComplete = ref<AautoCompleteCondicoes[]>([]) // Lista de possíveis condições para cada campo
const filtro = ref<FiltrosDoRelatorio>({} as FiltrosDoRelatorio) // Objeto gerado pelo form
const filtrosAplicados = ref<FiltrosDoRelatorio[]>([])
const isEditing = ref(false) // Controla que o filtro está em edição
const editingIndex = ref<number | null>(null) // Qual o indice da lista de filtros está em edição
const loadingRelatorio = ref(false) // Loading de geração de relatório

const montarFiltros = defineModel<DialogFiltrosRelatoriosClass>('montarFiltros', {
  required: true
})

//#region funcionalidades do vue

onBeforeMount(async () => {
  await getTabelasRelacionadas(); // Pegar todas as tabelas relacionadas com o relatório e exibir as mesmas para o usuário
})

watch(() => filtro.value.campoTabela, async (val) => { // Sempre que o campo for alterado a lista de condições também deve ser alterada
  if (val) {
    // Limpa os dados atuais após a mudança
    filtro.value.condicao = null
    filtro.value.searchRegistro = ''
    filtro.value.intervaloRegistros = []

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

watch(() => filtro.value.condicao, async (val) => { // Se a condição for alterada, limpar os campos que antes estavam sendo usados para não resultar em conflito nas variáveis
  filtro.value.searchRegistro = ''
  filtro.value.intervaloRegistros = []

  // Abaixo apenas iremos pegar qual é o tipo do input com base nos atributos selecionados
  if (val) {
    try {
      const response = await relatoriosServices.getCamposTabela(tab.value, filtro.value.campoTabela);
      tipoInputConsulta.value = response[0].tipo
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    }
  }
})

watch(() => tab.value, (val) => { // Sempre que a aba dos filtros for alterada, deve limpar o formulário
  if (val) {
    filtro.value = {} as FiltrosDoRelatorio
    filtrosAplicados.value = filtrarFiltrosAplicadosPorTabela();
  }

  if (tab.value == 'filtros')
    filtrosAplicados.value = montarFiltros.value.getFiltrosAplicados();
})

defineExpose({ getTabelasRelacionadas }) // Método que será exposto para o pai realizar a chamada, deve ser revisto e ajustado

//#endregion

function clearFields() {
  filtro.value = {} as FiltrosDoRelatorio
  montarFiltros.value.clearFields()
}

function closeDialog() {
  montarFiltros.value.closeDialog()
}

function cancelar() {
  closeDialog()
  tab.value = 'instrucoes'
  filtro.value.campoTabela = ''
  condicoesAutoComplete.value = []
}

function submitFormFiltro() {
  try {

    if (tipoInputConsulta.value == 'INTEIRO' && filtro.value.condicao != 'INTERVALO') {
      const isEmpty = !filtro.value.searchRegistro || filtro.value.searchRegistro.trim() === ''
      const isNotNumeric = isNaN(Number(filtro.value.searchRegistro))

      if (isEmpty || isNotNumeric) {
        throw new Error('Informe um valor numérico válido para o filtro.')
      }

      if (filtro.value.searchRegistro)
        filtro.value.searchRegistro = filtro.value.searchRegistro.replace(/\D/g, '')
    }

    if (tipoInputConsulta.value == 'INTEIRO' && filtro.value.condicao == 'INTERVALO') {
      const isEmpty0 = !filtro.value.intervaloRegistros[0] || filtro.value.intervaloRegistros[0].trim() === ''
      const isEmpty1 = !filtro.value.intervaloRegistros[1] || filtro.value.intervaloRegistros[1].trim() === ''
      const isNotNumeric0 = isNaN(Number(filtro.value.intervaloRegistros[0]))
      const isNotNumeric1 = isNaN(Number(filtro.value.intervaloRegistros[1]))

      if (isEmpty0 || isEmpty1 || isNotNumeric0 || isNotNumeric1) {
        throw new Error('Informe um valor numérico válido para o filtro.')
      }

      if (filtro.value.intervaloRegistros[0])
        filtro.value.intervaloRegistros[0] = filtro.value.intervaloRegistros[0].replace(/\D/g, '')

      if (filtro.value.intervaloRegistros[1])
        filtro.value.intervaloRegistros[1] = filtro.value.intervaloRegistros[1].replace(/\D/g, '')
    }

    adicionarOuEditarFiltro(filtro.value);
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

function editarFiltro(index: number) {
  const filtroSelecionado = filtrosAplicados.value[index]
  filtro.value = { ...toRaw(filtroSelecionado) }
  isEditing.value = true
  editingIndex.value = index
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
  filtro.value = {} as FiltrosDoRelatorio
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
