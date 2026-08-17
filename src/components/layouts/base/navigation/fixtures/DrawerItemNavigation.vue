<template>
  <v-tooltip :text="tituloItem">
    <template #activator="{ props: tooltipProps }">
      <v-list-item
        v-bind="tooltipProps"
        :prependIcon="item.icon"
        :title="tituloItem"
        :to="item.name ? { name: item.name } : item.path"
        :active="itemAtivo"
      >
        <template
          v-if="item.hotkey && mdAndUp && isPinned"
          #append
        >
          <v-hotkey
            :keys="item.hotkey"
            displayMode="icon"
            variant="contained"
            platform="auto"
          />
        </template>
      </v-list-item>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDisplay, useHotkey } from 'vuetify';

// Types e Interfaces
import type { IRouteMeta } from '@/models/model/IRouteMeta';

// Composables
import { useNavigation } from '@/composables/useNavigation';

/**
 * @property {IRouteMeta} item - O item de navegação a ser renderizado.
 * @property {boolean} isPinned - Indica se o drawer está fixado.
 * @property {boolean} drawerCompacto - Indica se o drawer está em modo rail sem hover.
 */
type TProps = {
  item: IRouteMeta;
  isPinned: boolean;
  drawerCompacto?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  drawerCompacto: false,
});

// Composables
const { mdAndUp } = useDisplay();
const { t } = useI18n();
const router = useRouter();
const { rotaAtualCorrespondeItem } = useNavigation();

// Computadas
const itemAtivo = computed(() => rotaAtualCorrespondeItem(props.item));
const tituloItem = computed(() => t(props.item.title || ''));

/**
 * Registra a hotkey acoplada ao ciclo de vida deste item específico.
 */
if (props.item.hotkey && props.item.name) {
  useHotkey(props.item.hotkey, () => {
    router.push({ name: props.item.name });
  });
}
</script>
