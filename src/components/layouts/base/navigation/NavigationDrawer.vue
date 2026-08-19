<template>
  <v-navigation-drawer
    v-model="drawerVisivel"
    :rail="!menuFixado && mdAndUp"
    :expandOnHover="!menuFixado && mdAndUp"
    :temporary="!mdAndUp"
    app
    @mouseenter="drawerEmHover = true"
    @mouseleave="drawerEmHover = false"
  >
    <DrawerItemUsuario />

    <v-divider />

    <v-list
      density="compact"
      nav
    >
      <template
        v-for="item in itensNavegacao"
        :key="item.title"
      >
        <template v-if="item.children && item.children.length > 0">
          <template v-if="drawerCompacto">
            <DrawerItemNavigation
              :item="item"
              :isPinned="menuFixado"
              :drawerCompacto="drawerCompacto"
            />

            <DrawerItemNavigation
              v-for="child in item.children"
              :key="child.title"
              :item="child"
              :isPinned="menuFixado"
              :drawerCompacto="drawerCompacto"
            />
          </template>

          <v-list-group
            v-else
            :value="item.title"
          >
            <template #activator="{ props }">
              <v-tooltip
                :disabled="!deveExibirTooltipItem(item)"
                :text="obterTituloItem(item)"
                location="end"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-list-item
                    v-bind="mergeProps(props, tooltipProps)"
                    :active="itemEstaAtivo(item)"
                    :prependIcon="item.icon"
                    :title="obterTituloItem(item)"
                  />
                </template>
              </v-tooltip>
            </template>

            <DrawerItemNavigation
              v-for="child in item.children"
              :key="child.title"
              :item="child"
              :isPinned="menuFixado"
              :drawerCompacto="drawerCompacto"
            />
          </v-list-group>
        </template>

        <DrawerItemNavigation
          v-else
          :item="item"
          :isPinned="menuFixado"
          :drawerCompacto="drawerCompacto"
        />
      </template>
    </v-list>

    <template #append>
      <v-list
        density="compact"
        nav
      >
        <v-list-item
          :title="t('routes.logout.title')"
          :to="{ name: 'Login' }"
          prependIcon="mdi-logout"
          exact
          @click="sair"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useAuthStore } from '@/stores/auth.store';
import { usePreferencesStore } from '@/stores/preferences.store';

// Types e Interfaces
import type { IRouteMeta } from '@/models/model/IRouteMeta';

// Composables
import { useNavigation } from '@/composables/useNavigation';

import DrawerItemNavigation from '@/components/layouts/base/navigation/fixtures/DrawerItemNavigation.vue';

// Componentes
import DrawerItemUsuario from './fixtures/DrawerItemUsuario.vue';

// Stores
const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();

// Composables
const { menuItems, rotaAtualCorrespondeItem } = useNavigation();
const { mdAndUp } = useDisplay();
const { t } = useI18n();
const router = useRouter();

// Constantes
const LIMITE_CARACTERES_TOOLTIP = 22;

// Reativas
const drawerEmHover = ref(false);

// Funções
function sair(): void {
  authStore.logout();
  router.push({ name: 'Login' });
}

/**
 * @description Verifica se o item de navegação está ativo.
 * Trata quando existem filtros persistidos nos parâmetros da rota quando não tem mapeamento de parâmetros no routes.ts.
 * @param {IRouteMeta} pItem - O item de navegação a ser verificado.
 * @returns {boolean} - Retorna true se o item estiver ativo, false caso contrário.
 */
function itemEstaAtivo(pItem: IRouteMeta): boolean {
  return rotaAtualCorrespondeItem(pItem) || Boolean(pItem.children?.some(itemEstaAtivo));
}

/**
 * @description Resolve o título traduzido do item antes de renderizar ou exibir o tooltip.
 * @param pItem Item de navegação cujo título será traduzido.
 * @returns Título traduzido do item.
 */
function obterTituloItem(pItem: IRouteMeta): string {
  return t(pItem.title || '');
}

/**
 * @description Indica se o tooltip deve aparecer quando o drawer está compacto ou o texto tende a truncar.
 * @param pItem Item de navegação avaliado.
 * @returns `true` quando o item precisa de tooltip.
 */
function deveExibirTooltipItem(pItem: IRouteMeta): boolean {
  return drawerCompacto.value || obterTituloItem(pItem).length > LIMITE_CARACTERES_TOOLTIP;
}

// Computadas
const drawerVisivel = computed({
  get: () => preferencesStore.preferences.drawer.isDesktopDrawerVisible,
  set: (pValor) => preferencesStore.setDesktopDrawerVisible(pValor),
});

const menuFixado = computed(() => preferencesStore.preferences.drawer.isDrawerPinned);

const itensNavegacao = computed(() => menuItems.value);
const drawerCompacto = computed(() => !menuFixado.value && mdAndUp.value && !drawerEmHover.value);
</script>
