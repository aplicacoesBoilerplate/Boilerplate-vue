<template>
  <v-list-item
    :title="getDescricaoCampo()"
    elevation="4"
    rounded="te-xl bs-xl"
  >
    <template #prepend>
      <div
        class="d-flex align-center"
        style="width: 30px"
      >
        <v-icon
          :icon="getIconCampo()"
          size="26"
        />
      </div>
    </template>

    <template #subtitle>
      <div class="d-flex align-center mt-1">
        <v-icon
          :icon="getIconOperador()"
          size="small"
          class="mr-1"
        />
        <span class="font-weight-medium mr-1 text-caption">{{ getDescricaoOperador() }}:</span>
        <span class="text-caption">{{ filtro.valor }}</span>
      </div>
    </template>

    <template #append>
      <v-row
        class="d-flex align-center flex-row"
        dense
      >
        <v-btn
          icon="mdi-pencil"
          color="primary"
          variant="text"
          density="compact"
          @click="$emit('onEditar', index)"
        />

        <v-btn
          icon="mdi-trash-can"
          color="error"
          variant="text"
          density="compact"
          @click="$emit('onRemover', index)"
        />
      </v-row>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
// Ecossistema Vue
// Constantes
import { useI18n } from 'vue-i18n';

import { MAPEAMENTO_OPERADORES } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';
import type { TCampoFiltroMapeado } from '@/models/filters/MapeamentoFiltros';

type TProps = {
  filtro: TFiltroConsultaSerializado;
  index: number;
  camposDisponiveis: TCampoFiltroMapeado[];
};

const props = defineProps<TProps>();

type TEmits = {
  onEditar: [index: number];
  onRemover: [index: number];
};
defineEmits<TEmits>();

// Composables
const { t, te } = useI18n();

// Funções
const getIconCampo = () => {
  if (props.filtro.campo) {
    const campoEncontrado = props.camposDisponiveis.find((pCampo) => pCampo.valor === props.filtro.campo);
    return campoEncontrado?.icone || 'mdi-filter-variant';
  }
};

const getIconOperador = () => {
  if (props.filtro.condicao) {
    const operadorEncontrado = MAPEAMENTO_OPERADORES.find((pOperador) => pOperador.valor === props.filtro.condicao);
    return operadorEncontrado?.icone || 'mdi-filter';
  }
};

const getDescricaoCampo = (): string => {
  if (props.filtro.campo) {
    const campoEncontrado = props.camposDisponiveis.find((pCampo) => pCampo.valor === props.filtro.campo);
    if (!campoEncontrado) return props.filtro.campo;

    const chave = `components.dialogFiltro.campos.${campoEncontrado.valor}`;
    return te(chave) ? t(chave) : campoEncontrado.descricao;
  }
  return '';
};

const getDescricaoOperador = (): string => {
  if (props.filtro.condicao) {
    const operadorEncontrado = MAPEAMENTO_OPERADORES.find((pOperador) => pOperador.valor === props.filtro.condicao);
    if (!operadorEncontrado) return props.filtro.condicao;

    const chave = `components.dialogFiltro.operadores.${operadorEncontrado.valor}`;
    return te(chave) ? t(chave) : operadorEncontrado.descricao;
  }
  return '';
};
</script>
