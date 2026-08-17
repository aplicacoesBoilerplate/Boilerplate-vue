<template>
  <AutocompleteSelecionarOpcao
    v-model:valor="papelSelecionado"
    :appendInnerIcon="iconeSelecionado"
    :density="density"
    :desabilitado="disabled"
    :hideDetails="hideDetails"
    :label="labelExibido"
    :menuProps="menuProps"
    :opcoes="opcoesDisponiveis"
    :rules="rules"
    :style="estilosLargura"
    :variant="variant"
    class="mt-1"
  />
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Models
import { ICONE_PAPEL, MAPEAMENTO_OPCOES_PAPEIS_PADROES } from '@/models/model/core/usuario.model';
// Types e Interfaces
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
import type { TPapel, TPapelPadrao } from '@/models/model/core/usuario.model';
import type { ValidationRule } from 'vuetify';

// Componentes
import AutocompleteSelecionarOpcao from './AutocompleteSelecionarOpcao.vue';

/**
 * @property {IOpcaoSelecao<TPapel>[]} opcoes - Papéis disponíveis; quando ausente, usa os papéis padrão.
 * @property {string} label - Rótulo exibido no campo.
 * @property {readonly ValidationRule[]} rules - Regras de validação aplicadas pelo formulário.
 * @property {boolean | 'auto'} hideDetails - Controla a exibição de detalhes do campo.
 * @property {string | number} maxWidth - Largura máxima aplicada ao campo.
 * @property {string | number} minWidth - Largura mínima aplicada ao campo.
 * @property {'default' | 'comfortable' | 'compact'} density - Densidade visual aplicada ao campo.
 * @property {'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain'} variant - Variante visual do Vuetify.
 * @property {boolean} disabled - Desabilita a seleção.
 * @property {Record<string, unknown>} menuProps - Propriedades adicionais repassadas ao menu de opções.
 */
type TProps = {
  opcoes?: IOpcaoSelecao<TPapel>[];
  label?: string;
  rules?: readonly ValidationRule[];
  hideDetails?: boolean | 'auto';
  maxWidth?: string | number;
  minWidth?: string | number;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
  disabled?: boolean;
  menuProps?: Record<string, unknown>;
};
const props = withDefaults(defineProps<TProps>(), {
  opcoes: undefined,
  label: undefined,
  rules: () => [],
  hideDetails: false,
  maxWidth: undefined,
  minWidth: undefined,
  density: 'compact',
  variant: 'outlined',
  disabled: false,
  menuProps: () => ({}),
});

// Composables
const { t } = useI18n();

// Reativas - Model
const papelSelecionado = defineModel<TPapel>();

// Computadas
const labelExibido = computed(() => props.label ?? t('forms.formUser.inputRole.label'));
const opcoesDisponiveis = computed(() => props.opcoes ?? Object.values(MAPEAMENTO_OPCOES_PAPEIS_PADROES));
const estilosLargura = computed(() => ({
  maxWidth: props.maxWidth,
  minWidth: props.minWidth,
}));
const iconeSelecionado = computed(() => {
  if (!papelSelecionado.value) {
    return '';
  }

  return (
    opcoesDisponiveis.value.find((pOpcao) => pOpcao.valor === papelSelecionado.value)?.icone ??
    ICONE_PAPEL[papelSelecionado.value as TPapelPadrao] ??
    ''
  );
});
</script>
