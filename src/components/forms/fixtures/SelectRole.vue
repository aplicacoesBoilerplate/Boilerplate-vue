<template>
  <v-autocomplete
    v-model="papelSelecionado"
    :rules="rules"
    :items="itensSelect"
    :label="labelExibido"
    :prependInnerIcon="iconeSelecionado"
    :density="density"
    :variant="variant"
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

// Types e Interfaces
import { MAPEAMENTO_PAPEIS, type TPapel } from '@/models/model/usuario/lUsuario';

type TProps = {
  /**
   * Mensagem de label para o input.
   */
  label?: string;

  /**
   * Regras de validação do Vuetify.
   */
  rules?: readonly any[];

  /**
   * Densidade do componente.
   */
  density?: 'default' | 'comfortable' | 'compact';

  /**
   * Variante visual do componente.
   */
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
};
const props = withDefaults(defineProps<TProps>(), {
  label: undefined,
  rules: () => [],
  density: 'compact',
  variant: 'outlined',
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
  return Object.values(MAPEAMENTO_PAPEIS);
});

const iconeSelecionado = computed((): string | undefined => {
  if (!papelSelecionado.value) {
    return undefined;
  }
  
  return MAPEAMENTO_PAPEIS[papelSelecionado.value]?.icone;
});
</script>
