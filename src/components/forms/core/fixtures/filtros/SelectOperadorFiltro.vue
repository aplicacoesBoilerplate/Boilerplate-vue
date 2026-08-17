<template>
  <v-row>
    <v-col
      :cols="larguraOperador"
      class="col-animada pb-0"
    >
      <v-select
        v-model="filterModel.condicao"
        :label="props.label === 'Operador' ? t('components.selectOperadorFiltro.label') : props.label"
        :variant="variant"
        :density="density"
        :appendInnerIcon="iconeOperadorSelecionado"
        :menuProps="{ closeOnContentClick: true }"
        :items="operadoresTraduzidos"
        itemTitle="descricao"
        itemValue="valor"
        autocomplete="off"
        hideDetails
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps">
            <template #append>
              <v-icon
                :icon="item.icone"
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
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';

// Composables
import { useOperadoresFiltro } from '@/composables/useOperadoresFiltro';

// Componentes
import InputValorFiltro from './InputValorFiltro.vue';

type TOpcaoSelecaoVuetify = {
  title: string;
  value: unknown;
};

type TProps = {
  opcoesDisponiveis: TOpcaoSelecaoVuetify[];
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

const { mdAndDown } = useDisplay();
const { t, te } = useI18n();

// Reativas
const filterModel = defineModel<Partial<TFiltroConsultaSerializado>>('filterModel', { required: true });

// Funções
function sincronizarOperadorDisponivel(): void {
  const operadoresAtuais = operadoresDisponiveis.value;
  const operadorAtual = filterModel.value.condicao;

  if (operadoresAtuais.length === 0) {
    return;
  }

  const operadorAtualDisponivel = operadoresAtuais.some((pOperador) => pOperador.valor === operadorAtual);

  if (!operadorAtualDisponivel) {
    filterModel.value.condicao = String(operadoresAtuais[0].valor);
    filterModel.value.valor = undefined;
    filterModel.value.valoresSelecionados = [];
  }
}

// Computadas
const operadoresTraduzidos = computed(() => {
  return operadoresDisponiveis.value.map((pOperador) => {
    const chave = `components.dialogFiltro.operadores.${pOperador.valor}`;
    return {
      ...pOperador,
      descricao: te(chave) ? t(chave) : pOperador.descricao,
    };
  });
});

const controleTamanhoColunas = computed(() => {
  if (!filterModel.value.condicao) return false;
  const operadoresComDoisInputs = [EOperadoresFiltro.ENTRE];

  return operadoresComDoisInputs.includes(filterModel.value.condicao as EOperadoresFiltro);
});

const larguraOperador = computed(() => (controleTamanhoColunas.value || mdAndDown.value ? 12 : 6));
const larguraValor = computed(() => (controleTamanhoColunas.value || mdAndDown.value ? 12 : 6));
const iconeOperadorSelecionado = computed(
  () => operadoresDisponiveis.value.find((pOperador) => pOperador.valor === filterModel.value.condicao)?.icone,
);

// Observadores
watch(
  () => [
    genericFilterStore.campoSelecionado?.valor,
    operadoresDisponiveis.value.map((pOperador) => pOperador.valor).join('|'),
  ],
  () => {
    sincronizarOperadorDisponivel();
  },
  { immediate: true },
);
</script>

<style scoped>
.col-animada {
  transition:
    max-width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    flex 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
