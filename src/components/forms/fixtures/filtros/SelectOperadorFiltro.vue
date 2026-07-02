<template>
  <v-row density="comfortable">
    <v-col
      :cols="larguraOperador"
      class="col-animada pb-0"
    >
      <v-autocomplete
        v-model="filterModel.condicao"
        :label="label"
        :variant="variant"
        :density="density"
        :appendInnerIcon="iconeOperadorSelecionado"
        :menuProps="{ closeOnContentClick: true }"
        :items="operadoresDisponiveis"
        itemTitle="descricao"
        itemValue="valor"
        autocomplete="off"
        hideDetails
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps">
            <template #append>
              <v-icon
                :icon="item.raw.icone"
                size="small"
                class="text-grey-darken-1"
              />
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-col>

    <v-col
      :cols="larguraValor"
      class="col-animada overflow-hidden"
    >
      <div>
        <InputValorFiltro
          v-if="filterModel.condicao"
          v-model:valor="filterModel.valor"
          :operador="filterModel.condicao"
          :tiposCampo="tiposCampoAtual"
          :opcoesDisponiveis="opcoesDisponiveis"
          :campo="filterModel.campo"
          @onEnter="$emit('onEnter')"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, watch } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta.ts';
import type { IOpcaoSelecaoFiltro } from '@/models/filters/IOpcaoSelecaoFiltro';

// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Composables
import { useOperadoresFiltro } from '@/composables/useOperadoresFiltro';

// Componentes
import InputValorFiltro from './InputValorFiltro.vue';

type TProps = {
  opcoesDisponiveis: IOpcaoSelecaoFiltro[];
  label?: string;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
};
const props = withDefaults(defineProps<TProps>(), {
  label: 'Operador',
  density: 'compact',
  variant: 'outlined',
});

type TEmits = {
  onEnter: [];
};
defineEmits<TEmits>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Composables
const { operadoresDisponiveis, tiposCampoAtual } = useOperadoresFiltro({
  campoSelecionado: computed(() => genericFilterStore.campoSelecionado),
});

// Reativas
const filterModel = defineModel<Partial<IFiltrosConsulta>>('filterModel', { required: true });

// Funções
function sincronizarOperadorDisponivel(): void {
  const operadoresAtuais = operadoresDisponiveis.value;
  const operadorAtual = filterModel.value.condicao;

  if (operadoresAtuais.length === 0) {
    return;
  }

  const operadorAtualDisponivel = operadoresAtuais.some((pOperador) => pOperador.valor === operadorAtual);

  if (!operadorAtualDisponivel) {
    filterModel.value = {
      ...filterModel.value,
      condicao: operadoresAtuais[0].valor,
      valor: undefined,
      valoresSelecionados: [],
    };
  }
}

// Computadas
const controleTamanhoColunas = computed(() => {
  if (!filterModel.value.condicao) return false;
  const operadoresComDoisInputs = [EOperadoresFiltro.ENTRE];

  return operadoresComDoisInputs.includes(filterModel.value.condicao as EOperadoresFiltro);
});

const larguraOperador = computed(() => (controleTamanhoColunas.value ? 12 : 6));
const larguraValor = computed(() => (controleTamanhoColunas.value ? 12 : 6));
const iconeOperadorSelecionado = computed(
  () => operadoresDisponiveis.value.find((operador) => operador.valor === filterModel.value.condicao)?.icone,
);

// Observadores
watch(() => [genericFilterStore.campoSelecionado?.valor, operadoresDisponiveis.value.map((pOperador) => pOperador.valor).join('|')], () => {
  sincronizarOperadorDisponivel();
}, { immediate: true });

</script>

<style scoped>
.col-animada {
  transition:
    max-width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    flex 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
