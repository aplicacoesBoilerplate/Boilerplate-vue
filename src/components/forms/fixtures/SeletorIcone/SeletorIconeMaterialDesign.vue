<template>
  <DialogSeletorIconeMaterialDesign
    v-model="icone"
    @selecionar="emits('selecionar', $event)"
  >
    <template #activator="{ props: dialogProps }">
      <v-text-field
        v-bind="dialogProps"
        :counter="counter"
        :density="density"
        :disabled="disabled"
        :hideDetails="hideDetails"
        :hint="hintPadrao"
        :label="labelPadrao"
        :modelValue="icone"
        :rules="rules"
        :variant="variant"
        :clearable="Boolean(icone)"
        autocomplete="off"
        spellcheck="false"
        readonly
        @click:clear.stop="limparIcone"
      >
        <template #append>
          <v-icon
            v-if="icone"
            :icon="icone"
            :aria-label="t('forms.seletorIconeMaterialDesign.previewAriaLabel', { icone })"
          />
        </template>
      </v-text-field>
    </template>
  </DialogSeletorIconeMaterialDesign>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ValidationRule } from 'vuetify';

// Utils
import { CNormalizadores } from '@/classes/Utils/CNormalizadores';

// Componentes
import DialogSeletorIconeMaterialDesign from './DialogSeletorIconeMaterialDesign.vue';

/**
 * @property {number} counter - Quantidade máxima de caracteres exibida no contador.
 * @property {'default' | 'comfortable' | 'compact'} density - Densidade visual aplicada ao campo.
 * @property {boolean | 'auto'} hideDetails - Controla a exibição de detalhes do campo.
 * @property {string} hint - Texto auxiliar exibido abaixo do campo.
 * @property {string} label - Rótulo exibido no campo.
 * @property {boolean} disabled - Desabilita a interação com o seletor.
 * @property {readonly ValidationRule[]} rules - Regras de validação aplicadas pelo formulário.
 * @property {'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain'} variant - Variante visual do Vuetify.
 */
type TProps = {
  counter?: number;
  density?: 'default' | 'comfortable' | 'compact';
  hideDetails?: boolean | 'auto';
  hint?: string;
  label?: string;
  disabled?: boolean;
  rules?: readonly ValidationRule[];
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
};
const props = withDefaults(defineProps<TProps>(), {
  counter: 60,
  density: 'compact',
  hideDetails: false,
  hint: undefined,
  label: undefined,
  disabled: false,
  rules: () => [],
  variant: 'outlined',
});

type TEmits = {
  selecionar: [pValorIcone: string];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();

// Reativas - Model
const icone = defineModel<string>({
  default: '',
  set: (pValor) => CNormalizadores.normalizarIconeMaterialDesign(pValor),
});

// Computadas
const hintPadrao = computed(() => props.hint ?? t('forms.seletorIconeMaterialDesign.hint'));
const labelPadrao = computed(() => props.label ?? t('forms.seletorIconeMaterialDesign.label'));

// Funções
/**
 * @description Remove o valor atual sem abrir o dialog de consulta.
 */
function limparIcone(): void {
  icone.value = '';
}
</script>
