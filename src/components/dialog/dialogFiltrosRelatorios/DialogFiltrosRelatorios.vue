<template>
  <v-dialog v-model="exibir" max-width="1100">

    <v-card prepend-icon=""
            :title="dialogFiltrosRelatorios.show ? `Filtros para gerar relatório: ${modelValue.relatorio.tipoRelatorio} - ${modelValue.relatorio.modeloRelatorio}` : ''"
    >
      <v-tabs
        v-model="tab"
        bg-color="primary"
        @update:modelValue="getCamposTabela(tab)"
      >
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

          <div v-for="aba in props.modelValue.filtros" :key="aba.tabela">
            <v-tabs-window-item :value="aba.tabela">
              <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
                <v-row dense class="mt-4">
                  <v-col cols="12" md="4" class="d-flex justify-center">
                    <v-autocomplete clearable v-model="aba.campoTabela" label="Campo*" :items="camposPorTabela"
                                    :rules="[rules.required]" variant="outlined">
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="4" class="d-flex justify-center">
                    <v-autocomplete clearable v-model="aba.condicao" label="Condição*" :items="condicoesAutoComplete"
                                    :item-title="'chave'" :item-value="'valor'"
                                    :rules="[rules.required]" variant="outlined">

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

                  <v-col cols="12" md="4">
                    <InputUpperCase v-model:="searchAuxiliar" :style="{
                      inputVariant: 'outlined',
                      label: 'Buscar por',
                      maxWidth: 650,
                      counter: 100,
                      inputDisabled: aba.condicao == 'INTERVALO'
                    }" :rules="[rules.requiredCondicionado(aba.condicao != 'SELECAO'), rules.max]" />
                  </v-col>

                </v-row>
              </v-form>
            </v-tabs-window-item>
          </div>

          <v-tabs-window-item value="filtros">
            <!-- Exibição dos filtros aplicados ao relatório -->
            <v-virtual-scroll :items="props.modelValue.filtros" max-height="250" item-height="50">
              <template v-slot:default="{ item: filtro }">
                <v-list-item :title="`${filtro.tabela}`">
                  <!-- Ícone de cartão de filtro -->
                  <template v-slot:prepend>
                    <v-icon>mdi-filter-outline</v-icon>
                  </template>

                  <!-- Botões para remover um filtro -->
                  <template v-slot:append>
                    <div class="pe-2">
                      <BtnOpenDialog :callback="() => removerFiltro()"
                                     :labelLeft="true"
                                     label="Remover filtro" size="small"
                                     variant="elevated" color="red" icon="mdi-window-close"
                                     title="Remover filtro"/>
                    </div>
                  </template>
                </v-list-item>
                <v-divider/>
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
        <v-spacer/>

        <v-btn color="red" variant="plain" @click="resetForm()">
          <v-icon class="pt-1">mdi-close</v-icon>
          Fechar
        </v-btn>
        <v-btn color="success" variant="tonal" :disabled="!formIsValid" type="submit">
          <v-icon class="pt-1">mdi-check</v-icon>
          Gerar
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
import type { DialogFiltrosRelatoriosClass } from "@/components/dialog/dialogFiltrosRelatorios/ClassDialogFiltrosRelatorios.ts";

// Models
import { CondicoesFiltrosAutoComplete, type FiltrosDoRelatorio } from "@/models/relatoriosModels/relatoriosModels.ts";

// Services
import { relatoriosServices } from "@/services/relatoriosService.ts";
import { useSnackbarStore } from "@/stores/SnackbarStore";
import { rules } from "@/utils/rules.ts";

// Vue
import {computed, onBeforeMount, ref, watch} from "vue";

const formRef = ref()
const formIsValid = ref(false)
const tab = ref()
const condicoesAutoComplete = CondicoesFiltrosAutoComplete
const searchAuxiliar = ref()

onBeforeMount(async () => {
  await getTabelasRelacionadas();
})

interface Props {
  modelValue: DialogFiltrosRelatoriosClass
}

const props = defineProps<Props>()
defineExpose({getTabelasRelacionadas})

const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogFiltrosRelatoriosClass): void
  // (e: 'operacao-concluida'): void
}>()

const dialogFiltrosRelatorios = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogFiltrosRelatorios.value.show,
  set: (val) => dialogFiltrosRelatorios.value.show = val
})

function submitForm() {

}

function clearFields() {
  dialogFiltrosRelatorios.value.clearFields()
}

function resetForm() {
  dialogFiltrosRelatorios.value.clearFields()
  dialogFiltrosRelatorios.value.closeDialog()
  exibir.value = false // Exibir componente
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

// props.modelValue.filtros.filter((filtro, index, self) =>
//   index === self.findIndex(f => f.tabela === filtro.tabela)
// )

function adicionarFiltro(filtro: FiltrosDoRelatorio) {
  props.modelValue.filtros.push(filtro)
}

function removerFiltro() {
  props.modelValue.filtros.pop()
}

const camposPorTabela = ref<string[]>()
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

<style scoped>

</style>
