<template>
  <v-autocomplete
    v-model="papelSelecionado"
    :rules="rules"
    :items="itensSelect"
    :label="labelExibido"
    :hideDetails="hideDetails"
    :maxWidth="maxWidth"
    :minWidth="minWidth"
    :prependInnerIcon="iconeSelecionado"
    :variant="variant"
    :density="density"
    :disabled="disabled"
    class="mt-1"
    itemTitle="label"
    itemValue="valor"
    autocomplete="off"
  >
    <template #item="{ props: pProps, item: pItem }">
      <v-list-item v-bind="pProps">
        <template #prepend>
          <v-icon
            :icon="pItem.raw.icone"
            size="small"
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
// Ecossistema
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { MAPEAMENTO_PAPEIS, type TPapel, type TPapelPadrao } from '@/models/model/core/usuario.model';
// Types e Interfaces
import type { ValidationRule } from 'vuetify';

export interface IItemSelectPapel {
  /**
   * Valor persistido no vínculo do usuário.
   */
  valor: TPapel;

  /**
   * Texto exibido no select.
   */
  label: string;

  /**
   * Ícone exibido na seleção e na listagem.
   */
  icone: string;
}

type TProps = {
  /**
   * Mensagem de label para o input.
   */
  label?: string;

  /**
   * Itens exibidos no select. Quando ausente, usa o mapeamento padrão de papéis.
   */
  itens?: IItemSelectPapel[];

  /**
   * Regras de validação do Vuetify.
   */
  rules?: readonly ValidationRule[];

  /**
   * Controla a exibição dos detalhes do campo.
   */
  hideDetails?: boolean | 'auto';

  /**
   * Largura máxima aplicada ao campo.
   */
  maxWidth?: string | number;

  /**
   * Largura mínima aplicada ao campo.
   */
  minWidth?: string | number;

  /**
   * Densidade do componente.
   */
  density?: 'default' | 'comfortable' | 'compact';

  /**
   * Variante visual do componente.
   */
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';

  /**
   * Desabilita a seleção.
   */
  disabled?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  hideDetails: false,
  itens: undefined,
  label: undefined,
  maxWidth: undefined,
  minWidth: undefined,
  rules: () => [],
  density: 'compact',
  variant: 'outlined',
  disabled: false,
});

// Composables
const { t } = useI18n();

// Reativas
const papelSelecionado = defineModel<TPapel>();

// Computadas
const labelExibido = computed((): string => {
  return props.label ?? t('forms.formUser.inputRole.label');
});

const itensSelect = computed(() => {
  return props.itens ?? Object.values(MAPEAMENTO_PAPEIS);
});

const iconeSelecionado = computed((): string | undefined => {
  if (!papelSelecionado.value) {
    return undefined;
  }

  return (
    itensSelect.value.find((pItem) => pItem.valor === papelSelecionado.value)?.icone ??
    MAPEAMENTO_PAPEIS[papelSelecionado.value as TPapelPadrao]?.icone
  );
});
</script>
