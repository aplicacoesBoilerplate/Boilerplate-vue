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
                v-model:filter-model="genericFilterStore.filterModel"
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
import { computed, ref, nextTick, watch } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Composables
import { useOpcoesSelecaoFiltro } from '@/composables/useOpcoesSelecaoFiltro';

// Componentes
import SelectOperadorFiltro from './fixtures/filtros/SelectOperadorFiltro.vue';
import BaseForm from './base/BaseForm.vue';
import CampoSelecionado from '../dialogs/filtros/fixtures/CampoSelecionado.vue';

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
  baseFormRef.value?.resetValidation();
}

async function refreshForm(): Promise<void> {
  genericFilterStore.filterModel = {
    campo: genericFilterStore.filterModel.campo,
    condicao: genericFilterStore.filterModel.condicao,
  };

  await nextTick();
  baseFormRef.value?.resetValidation();
}

// Observadores
watch(() => campoSelecionadoAtual.value?.valor, () => {
  exibirConsultaRegistros.value = false;
});

// Expose
defineExpose({
  refreshForm,
  submit: () => baseFormRef.value?.submit(),
});
</script>
