<template>
  <v-dialog v-model="exibir" max-width="1100">

    <v-card prepend-icon=""
      :title="props.modelValue.show ? `Filtros para gerar relatório: ${modelValue.relatorio.tipoRelatorio} - ${modelValue.relatorio.modeloRelatorio}` : ''">
      <v-tabs v-model="tab" bg-color="primary" @update:modelValue="getCamposTabela(tab)">
        <v-tab value="gerais">Opções gerais</v-tab>
        <v-tab v-for="aba in abasPorTabela" :key="aba" :value="aba">
          {{ aba }}
        </v-tab>
        <v-tab value="filtros">Filtros aplicados</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="gerais">
            Gerais
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
                              ]"
                  />
                  </v-col>

                  <!-- Input para tipo INTEIRO ÚNICO -->
                  <v-col cols="12" v-if="tipoInputConsulta == 'INTEIRO' && (filtro.condicao != 'INTERVALO' && filtro.condicao != null)">
                    <InputUpperCase v-model:="filtro.searchRegistro" v-numeric-mask
                      :style="{
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
                                ]"
                    />
                  </v-col>

                  <!-- Input para tipo INTEIRO INTERVALO -->
                  <v-col cols="12" md="6" v-if="tipoInputConsulta == 'INTEIRO' && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[0]" v-numeric-mask
                      :style="{
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
                                ]"
                  />
                  </v-col>

                  <v-col cols="12" md="6" v-if="tipoInputConsulta == 'INTEIRO' && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[1]" v-numeric-mask
                      :style="{
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
                                ]"
                  />
                  </v-col>

                  <!-- Input para tipo BOOLEAN não tem necessidade, a condição já é o suficiente -->

                  <!-- Input para tipo DATA ÚNICO -->
                  <v-col cols="12" v-if="tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME' && (filtro.condicao != 'INTERVALO' && filtro.condicao != null)">
                    <InputUpperCase v-model:="filtro.searchRegistro" v-data-mask
                      :style="{
                        inputVariant: 'outlined',
                        label: 'Valor',
                        maxWidth: 1100,
                        hint: 'Campo de data para consulta (DD/MM/YYYY)',
                        counter: 100,
                        inputDisabled: filtro.condicao == null
                      }" :rules="[rules.requiredCondicionado(
                                    (tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME')
                                    && filtro.condicao != 'INTERVALO'
                                    && (filtro.searchRegistro == null || filtro.searchRegistro == '')
                                  )
                                ]"
                  />
                  </v-col>

                  <!-- Input para tipo DATA INTERVALO -->
                  <v-col cols="12" md="6" v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.intervaloRegistros[0]" v-data-mask
                      :style="{
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
                                ]"
                  />
                  </v-col>
                  <v-col cols="12" md="6" v-if="(tipoInputConsulta == 'DATA' || tipoInputConsulta == 'DATETIME') && filtro.condicao == 'INTERVALO'">
                    <InputUpperCase v-model:="filtro.searchRegistro" v-data-mask
                      :style="{
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
                                ]"
                  />
                  </v-col>

                  <v-col cols="12">
                    <!-- Botão para adiconar um filtro -->
                    <v-btn
                      v-if="tab != 'gerais' && tab != 'filtros'"
                      :disabled="!formIsValid" type="submit"
                      title="Adicionar filtro" label="Adicionar filtro"
                      variant="tonal" color="success" class="w-100"
                    >
                      <v-icon>mdi-plus-circle-outline</v-icon>
                      Adicionar filtro
                    </v-btn>
                  </v-col>
                  </v-row>
                </v-form>

                <v-virtual-scroll :items="filtrarFiltrosAplicadosPorTabela()" max-height="250" item-height="50">
                  <template v-slot:default="{ item: filtro }">
                    <v-list-item :title="`${filtro.tabela}`">
                      <!-- Ícone de cartão de filtro -->
                      <template v-slot:prepend>
                        <v-icon>mdi-filter-outline</v-icon>
                      </template>

                      <v-row>
                        <v-col cols="4">
                          CAMPO: <br> {{ filtro.campoTabela }}
                        </v-col>
                        <v-col cols="4">
                          CONDIÇÃO: <br> {{ filtro.condicao }}
                        </v-col>
                        <v-col cols="4" v-if="filtro.condicao == 'INTERVALO'">
                          ENTRE: <br> {{ filtro.intervaloRegistros[0] }} - {{ filtro.intervaloRegistros[1] }}
                        </v-col>
                        <v-col cols="4" v-else>
                          VALOR: <br> {{ filtro.searchRegistro }}
                        </v-col>
                      </v-row>

                      <!-- Botões para remover um filtro -->
                      <template v-slot:append>
                        <div>
                          <BtnOpenDialog :callback="() => removerFiltro()" :labelLeft="true"
                            size="small" variant="elevated" color="red" icon="mdi-window-close" title="Remover filtro" />
                        </div>
                      </template>
                    </v-list-item>
                    <v-divider />
                  </template>
                </v-virtual-scroll>
            </v-tabs-window-item>
          </div>

          <v-tabs-window-item value="filtros">
            <!-- Exibição dos filtros aplicados ao relatório -->
            <v-virtual-scroll :items="filtrosAplicados" max-height="500" item-height="50">
              <template v-slot:default="{ item: filtro }">
                <v-list-item :title="`${filtro.tabela}`">
                  <!-- Ícone de cartão de filtro -->
                  <template v-slot:prepend>
                    <v-icon>mdi-filter-outline</v-icon>
                  </template>

                  <v-row>
                    <v-col cols="4">
                      CAMPO: <br> {{ filtro.campoTabela }}
                    </v-col>
                    <v-col cols="4">
                      CONDIÇÃO: <br> {{ filtro.condicao }}
                    </v-col>
                    <v-col cols="4" v-if="filtro.condicao == 'INTERVALO'">
                      ENTRE: <br> {{ filtro.intervaloRegistros[0] }} - {{ filtro.intervaloRegistros[1] }}
                    </v-col>
                    <v-col cols="4" v-else>
                      VALOR: <br> {{ filtro.searchRegistro }}
                    </v-col>
                  </v-row>

                  <!-- Botões para remover um filtro -->
                  <template v-slot:append>
                    <div>
                      <BtnOpenDialog :callback="() => removerFiltro()" :labelLeft="true"
                        size="small" variant="elevated" color="red" icon="mdi-window-close" title="Remover filtro" />
                    </div>
                  </template>
                </v-list-item>
                <v-divider />
              </template>
            </v-virtual-scroll>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" variant="plain" @click="clearFields()">
          <v-icon class="pt-1">mdi-refresh</v-icon>
          Limpar
        </v-btn>
        <v-spacer />

        <v-btn color="red" variant="plain" @click="cancelar()">
          <v-icon class="pt-1">mdi-close</v-icon>
          Fechar
        </v-btn>

        <!-- Botão para gerar um relatório -->
        <v-btn
          color="success" variant="tonal"
        >
          <v-icon class="pt-1">mdi-check</v-icon>
          Gerar relatório
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue";

// Classes
import { DialogFiltrosRelatoriosClass } from "@/components/dialog/dialogFiltrosRelatorios/ClassDialogFiltrosRelatorios.ts";

// Models
import { CondicoesFiltrosAutoComplete, type autoCompleteCondicoes, type FiltrosDoRelatorio, type PossiveisFiltrosDoCampo } from "@/models/relatoriosModels/relatoriosModels.ts";

// Services
import { relatoriosServices } from "@/services/relatoriosService.ts";
import { useSnackbarStore } from "@/stores/SnackbarStore";
import { rules } from "@/utils/rules.ts";

// Vue
import { computed, onBeforeMount, ref, watch } from "vue";

const tab = ref()
const formRef = ref()
const formIsValid = ref(false)
const tipoInputConsulta = ref('')
const filtrosAplicados = ref<FiltrosDoRelatorio[]>([])
const classFiltros = ref(new DialogFiltrosRelatoriosClass())
const condicoesAutoComplete = ref<autoCompleteCondicoes[]>([])
const filtro = ref<FiltrosDoRelatorio>({} as FiltrosDoRelatorio)

onBeforeMount(async () => {
  await getTabelasRelacionadas();
})

watch(() => filtro.value.campoTabela, async (val) => {
  if (val) {
    filtro.value.condicao = null
    filtro.value.searchRegistro = ''
    filtro.value.intervaloRegistros = []
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

watch(() => filtro.value.condicao, async (val) => {
  filtro.value.searchRegistro = ''
  filtro.value.intervaloRegistros = []
  if (val) {
    try {
      const response = await relatoriosServices.getCamposTabela(tab.value, filtro.value.campoTabela);
      tipoInputConsulta.value = response[0].tipo
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    }
  }
})

watch(() => tab.value, (val) => {
  if (val) {
    filtro.value = {
      showFiltro: true,
      tabela: tab.value,
      campoTabela: '',
      searchRegistro: '',
      intervaloRegistros: [],
      condicao: null
    }
  }

  if (tab.value == 'filtros')
    filtrosAplicados.value = classFiltros.value.getFiltrosAplicados()
})

interface Props {
  modelValue: DialogFiltrosRelatoriosClass
}

const props = defineProps<Props>()
defineExpose({ getTabelasRelacionadas })

const exibir = computed({
  get: () => props.modelValue.show,
  set: (val) => props.modelValue.show = val
})

function clearFields() {
  props.modelValue.clearFields()
}

function closeDialog() {
  props.modelValue.closeDialog()
}

function cancelar() {
  closeDialog()
  tab.value = 'gerais'
  filtro.value.campoTabela = ''
  condicoesAutoComplete.value = []
}

const abasPorTabela = ref<string[]>()
async function getTabelasRelacionadas() {
  try {
    const response = await relatoriosServices.getTabelasRelacionadas(props.modelValue.relatorio.modeloRelatorio);
    abasPorTabela.value = response
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  }
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

    adicionarFiltro(filtro.value)
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  }
}

function adicionarFiltro(filtro?: FiltrosDoRelatorio) {
  if (filtro) {
    props.modelValue.filtros.push(filtro)
    filtrosAplicados.value = classFiltros.value.getFiltrosAplicados()
    classFiltros.value.setFiltro(filtro)
  }
}

function filtrarFiltrosAplicadosPorTabela() {
  return props.modelValue.filtros.filter(filtro => filtro.tabela === tab.value)
}

function removerFiltro() {
  props.modelValue.filtros.pop()
}

const camposPorTabela = ref<PossiveisFiltrosDoCampo[]>()
async function getCamposTabela(tabela: string, campo?: string) {
  if (!tabela || tabela === 'gerais' || tabela === 'filtros') return;

  try {
    const response = await relatoriosServices.getCamposTabela(tabela, campo);
    camposPorTabela.value = response
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  }
}

</script>

<style scoped></style>
