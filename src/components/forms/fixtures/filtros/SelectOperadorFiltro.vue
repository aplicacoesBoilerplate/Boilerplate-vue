<template>
  <v-row density="comfortable">
    <v-col
      :cols="larguraOperador"
      class="col-animada pb-0"
    >
      <v-select
        v-model="filterModel.condicao"
        :label="label"
        :variant="variant"
        :density="density"
        :appendInnerIcon="iconeOperadorSelecionado"
        :menuProps="{ closeOnContentClick: true }"
        :items="operadores"
        itemTitle="descricao"
        itemValue="valor"
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
      </v-select>
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
          :tiposCampo="tiposCampo"
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
import { computed } from 'vue';

// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta.ts';
import type { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import type { IMapeamentoOperador } from '@/models/filters/enums/EOperadoresFiltro';

// Componentes
import InputValorFiltro from './InputValorFiltro.vue';

type TProps = {
  operadores: IMapeamentoOperador[];
  tiposCampo?: ETipoFiltro[];
  opcoesDisponiveis: any[];
  label?: string;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
};
const props = withDefaults(defineProps<TProps>(), {
  label: 'Operador',
  density: 'compact',
  variant: 'outlined',
  tiposCampo: () => [],
});

type TEmits = {
  onEnter: [];
};
defineEmits<TEmits>();

// Reativas
const filterModel = defineModel<Partial<IFiltrosConsulta>>('filterModel', { required: true });

// Computadas
const controleTamanhoColunas = computed(() => {
  if (!filterModel.value.condicao) return false;
  const operadoresComDoisInputs = [EOperadoresFiltro.ENTRE];

  return operadoresComDoisInputs.includes(filterModel.value.condicao as EOperadoresFiltro);
});

const larguraOperador = computed(() => (controleTamanhoColunas.value ? 12 : 6));
const larguraValor = computed(() => (controleTamanhoColunas.value ? 12 : 6));
const iconeOperadorSelecionado = computed(
  () => props.operadores.find((operador) => operador.valor === filterModel.value.condicao)?.icone,
);
</script>

<style scoped>
.col-animada {
  transition:
    max-width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    flex 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
