<template>
  <v-autocomplete
    v-model="cleanModel"
    :label="label"
    :variant="variant"
    :density="density"
    :appendInnerIcon="appendInnerIcon"
    :disabled="desabilitado"
    :rules="rules"
    :menuProps="menuProps"
    :hideDetails="hideDetails"
    :multiple="multiple"
    :clearable="clearable"
    :items="opcoes"
    itemTitle="descricao"
    itemValue="valor"
    autocomplete="off"
    @keypress.enter="$emit('onEnter')"
  >
    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template #append>
          <v-icon
            v-if="item.raw.icone"
            :icon="item.raw.icone"
            size="small"
            class="text-grey-darken-1"
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';

// Types e Interfaces
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
import type { TVuetifyRule } from '@/utils/rules';

/**
 * @property {IOpcaoSelecao[]} opcoes - Opções disponíveis para seleção.
 * @property {string} label - Rótulo exibido no campo.
 * @property {'default' | 'comfortable' | 'compact'} density - Densidade do campo.
 * @property {'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain'} variant - Variante visual.
 * @property {boolean} multiple - Permite seleção múltipla.
 * @property {boolean} clearable - Exibe botão de limpar.
 * @property {boolean} hideDetails - Oculta detalhes de validação.
 * @property {string} appendInnerIcon - Ícone exibido ao final do campo.
 * @property {boolean} desabilitado - Desabilita o campo.
 * @property {TVuetifyRule[]} rules - Regras de validação.
 * @property {Record<string, unknown>} menuProps - Propriedades adicionais do menu.
 * @property {unknown} valor - Valor selecionado (model).
 */
type TProps = {
  opcoes: IOpcaoSelecao[];
  label?: string;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
  multiple?: boolean;
  clearable?: boolean;
  hideDetails?: boolean;
  appendInnerIcon?: string;
  desabilitado?: boolean;
  rules?: TVuetifyRule[];
  menuProps?: Record<string, unknown>;
};
const props = withDefaults(defineProps<TProps>(), {
  label: '',
  density: 'compact',
  variant: 'outlined',
  multiple: false,
  clearable: false,
  hideDetails: true,
  appendInnerIcon: '',
  desabilitado: false,
  rules: () => [],
  menuProps: () => ({}),
});

/**
 * @property {[]} onEnter - Ao pressionar enter, o evento é disparado.
 */
type TEmits = {
  onEnter: [];
};
defineEmits<TEmits>();

// Reativas
const model = defineModel<unknown>('valor', { required: true });

// Computadas
const cleanModel = computed({
  get: () => model.value,
  set: (pVal) => {
    if (props.multiple && Array.isArray(pVal)) {
      model.value = pVal.filter((pV: unknown) => pV !== '');
    } else {
      model.value = pVal;
    }
  },
});
</script>
