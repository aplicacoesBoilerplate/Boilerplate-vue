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
          v-if="campoSelecionadoAtual"
          class="border rounded-lg w-100"
          variant="flat"
        >
          <CampoSelecionado
            v-model:exibirConsultaRegistros="exibirConsultaRegistros"
            :campoSelecionado="campoSelecionadoAtual"
          />

          <v-card-text class="pt-0 px-4 pb-4">
            <BaseForm
              ref="baseFormRef"
              @onSubmit="handleSubmit"
              @update:isValid="isFormValid = $event"
            >
              <SelectOperadorFiltro
                v-model:filterModel="genericFilterStore.filterModel"
                :opcoesDisponiveis="opcoesSelecaoValoresDoCampo"
              />

              <div class="mt-2 d-flex align-center">
                <v-tooltip
                  text="Limpar Valor(es) do Filtro Atual"
                  location="bottom"
                >
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
                </v-tooltip>

                <v-btn
                  :disabled="!isFormValid"
                  class="font-weight-medium ml-auto flex-grow-1"
                  color="primary"
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
          <span class="text-center">Selecione um campo no menu lateral para iniciar.</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref, watch } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Composables
import { useOpcoesSelecaoFiltro } from '@/composables/useOpcoesSelecaoFiltro';

import CampoSelecionado from '@/components/dialogs/core/filtros/fixtures/CampoSelecionado.vue';
import BaseForm from '@/components/forms/base/BaseForm.vue';

// Componentes
import SelectOperadorFiltro from './fixtures/filtros/SelectOperadorFiltro.vue';

type TProps = {
  registros?: object[];
};
const props = withDefaults(defineProps<TProps>(), {
  registros: () => [],
});

// Stores
const genericFilterStore = useGenericFilterStore();

// Reativas
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const isFormValid = ref(false);

// Reativas - Model
const exibirConsultaRegistros = defineModel<boolean>('exibirConsultaRegistros', { default: false });

// Computadas
const campoSelecionadoAtual = computed(() => genericFilterStore.campoSelecionado);
const registrosFiltro = computed(() => props.registros);

// Composables
const { opcoesSelecaoValoresDoCampo } = useOpcoesSelecaoFiltro({
  campoSelecionado: campoSelecionadoAtual,
  registros: registrosFiltro,
});

// Funções
function handleSubmit(): void {
  genericFilterStore.applyFilterModel();
  if (baseFormRef.value) {
    void baseFormRef.value.refreshForm(() => ({}));
  }
}

async function refreshForm(): Promise<void> {
  genericFilterStore.filterModel = {
    campo: genericFilterStore.filterModel.campo,
    condicao: genericFilterStore.filterModel.condicao,
  };

  if (baseFormRef.value) {
    await baseFormRef.value.refreshForm(() => ({}));
  }
}

// Observadores
watch(
  () => campoSelecionadoAtual.value?.valor,
  () => {
    exibirConsultaRegistros.value = false;
  },
);

/**
 * @description Métodos expostos pelo formulário de filtros.
 * @property {() => Promise<void>} refreshForm - Restaura o estado original do formulário.
 * @property {() => void} submit - Dispara a validação e submit do formulário.
 */
export interface IFormFiltrosExpose {
  refreshForm: () => Promise<void>;
  submit: () => void;
}

// Expose
defineExpose({
  refreshForm,
  submit: () => baseFormRef.value?.submit(),
} satisfies IFormFiltrosExpose);
</script>
