<template>
  <v-container
    class="pa-0"
    fluid
  >
    <v-row
      density="comfortable"
      justify="center"
      class="ma-0"
    >
      <v-col cols="12">
        <v-card
          v-if="selectedField"
          class="bg-grey-lighten-4 border rounded-lg w-100"
          variant="flat"
        >
          <CampoSelecionado :selectedField="selectedField" />

          <v-card-text class="pt-0 px-4 pb-4">
            <BaseForm
              ref="baseFormRef"
              @onSubmit="handleSubmit"
              @update:isValid="isFormValid = $event"
            >
              <SelectOperadorFiltro
                v-model:filter-model="genericFilterStore.filterModel"
                :operadores="operadoresBaseDisponiveis"
                :tiposCampo="tiposCampoAtual"
                :opcoesDisponiveis="opcoesSelecaoValoresDoCampo"
              />

              <div class="mt-2 d-flex align-center">
                <v-tooltip>
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      class="me-2"
                      color="amber-accent-3"
                      variant="plain"
                      rounded="xl"
                      icon="mdi-refresh"
                      @click="refreshForm()"
                    />
                  </template>
                  <span>Limpar Valor(es) do Filtro Atual</span>
                </v-tooltip>

                <v-btn
                  :disabled="!isFormValid"
                  class="font-weight-medium ml-auto flex-grow-1"
                  color="indigo-darken-4"
                  variant="elevated"
                  type="submit"
                  height="40"
                >ADICIONAR FILTRO
                </v-btn>
              </div>
            </BaseForm>
          </v-card-text>
        </v-card>

        <div
          v-else
          class="d-flex flex-column align-center justify-center mt-10 text-grey"
        >
          <v-icon
            icon="mdi-cursor-default-click"
            size="large"
            class="mb-2"
          />
          <span>Selecione um campo no menu lateral para iniciar.</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref, nextTick } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';

// Constante
import { EOperadoresFiltro, MAPEAMENTO_OPERADORES } from '@/models/filters/enums/EOperadoresFiltro';

// Componentes
import SelectOperadorFiltro from './fixtures/filtros/SelectOperadorFiltro.vue';
import BaseForm from './base/BaseForm.vue';
import CampoSelecionado from '../dialogs/filtros/fixtures/CampoSelecionado.vue';

type TProps = {
  selectedField: ICampoFiltro<any> | null;
  registros?: any[];
};
const props = defineProps<TProps>();

// Stores
const genericFilterStore = useGenericFilterStore();


// Reativas
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const isFormValid = ref(false);

// Funções
function handleSubmit() {
  genericFilterStore.applyFilterModel();
  baseFormRef.value?.resetValidation();
}

async function refreshForm() {
  genericFilterStore.filterModel = {
    campo: genericFilterStore.filterModel.campo,
    condicao: genericFilterStore.filterModel.condicao,
  };

  await nextTick();
  baseFormRef.value?.resetValidation();
}

// Computadas
const tiposCampoAtual = computed<ETipoFiltro[]>(() => {
  return props.selectedField?.tipos ?? [];
});

const operadoresBaseDisponiveis = computed(() => {
  if (!props.selectedField || !tiposCampoAtual.value) {
    return [];
  }

  // Verifica se o campo possui operadores específicos predefinidos
  if (props.selectedField.operadores && props.selectedField.operadores.length > 0) {
    return MAPEAMENTO_OPERADORES.filter((o) => props.selectedField!.operadores!.includes(o.valor));
  }

  const tipos = tiposCampoAtual.value;

  if (tipos.includes(ETipoFiltro.BOOLEAN)) {
    return MAPEAMENTO_OPERADORES.filter((o) => o.valor === EOperadoresFiltro.IGUAL);
  }

  if (tipos.includes(ETipoFiltro.SELECT)) {
    return MAPEAMENTO_OPERADORES.filter((o) =>
      [
        EOperadoresFiltro.IGUAL,
        EOperadoresFiltro.DIFERENTE,
        EOperadoresFiltro.SELECAO,
        EOperadoresFiltro.EXCECAO,
      ].includes(o.valor),
    );
  }

  if (tipos.includes(ETipoFiltro.NUMBER) || tipos.includes(ETipoFiltro.DATE)) {
    return MAPEAMENTO_OPERADORES.filter((o) =>
      [
        EOperadoresFiltro.IGUAL,
        EOperadoresFiltro.DIFERENTE,
        EOperadoresFiltro.MAIOR_QUE,
        EOperadoresFiltro.MENOR_QUE,
        EOperadoresFiltro.ENTRE,
      ].includes(o.valor),
    );
  }

  // Default fallback (String)
  return MAPEAMENTO_OPERADORES.filter((o) =>
    [
      EOperadoresFiltro.CONTEM,
      EOperadoresFiltro.NAO_CONTEM,
      EOperadoresFiltro.IGUAL,
      EOperadoresFiltro.DIFERENTE,
      EOperadoresFiltro.COMECA_COM,
      EOperadoresFiltro.TERMINA_COM,
    ].includes(o.valor),
  );
});

const opcoesSelecaoValoresDoCampo = computed(() => {
  if (!props.selectedField) {
    return [];
  }

  if (props.selectedField.opcoes && props.selectedField.opcoes.length > 0) {
    return props.selectedField.opcoes.map((op) => ({ title: op.descricao, value: op.valor }));
  }

  if (!props.registros || props.registros.length === 0) {
    return [];
  }

  const campoChave = props.selectedField.valor as string;

  const valoresNaoNulos = props.registros
    .map((item) => item[campoChave])
    .filter((val) => val !== null && val !== undefined);

  const valoresUnicos = [...new Set(valoresNaoNulos)];

  const opcoesMapeadas = valoresUnicos.map((val) => {
    let title = String(val);
    if (val === '') title = '(Vazio)';
    return { title, value: val };
  });

  return opcoesMapeadas.sort((a, b) => {
    if (typeof a.value === 'number' && typeof b.value === 'number') return a.value - b.value;
    return String(a.title).localeCompare(String(b.title));
  });
});

// Expose
defineExpose({
  refreshForm,
  submit: () => baseFormRef.value?.submit(),
});
</script>
