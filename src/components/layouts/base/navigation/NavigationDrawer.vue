<template>
  <v-navigation-drawer
    v-model="isDrawerVisible"
    :rail="!isPinned && mdAndUp"
    :expandOnHover="!isPinned && mdAndUp"
    :temporary="!mdAndUp"
    app
  >
    <DrawerItemUsuario />

    <v-divider />

    <v-list
      density="compact"
      nav
    >
      <template
        v-for="item in navItems"
        :key="item.title"
      >
        <v-list-group
          v-if="item.children && item.children.length > 0"
          :value="item.title"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :active="itemEstaAtivo(item)"
              :prependIcon="item.icon"
              :title="t(item.title || '')"
            />
          </template>

          <DrawerItemNavigation
            v-for="child in item.children"
            :key="child.title"
            :item="child"
            :isPinned="isPinned"
          />
        </v-list-group>

        <DrawerItemNavigation
          v-else
          :item="item"
          :isPinned="isPinned"
        />
      </template>
    </v-list>

    <template v-slot:append>
      <v-list
        density="compact"
        nav
      >
        <v-list-item
          :title="t('routes.logout.title')"
          :to="{ name: 'Login' }"
          prependIcon="mdi-logout"
          exact
          @click="handleLogout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

// Stores
import { useAuthStore } from "@/stores/auth";
import { usePreferencesStore } from "@/stores/preferences.store";

// Composables
import { useNavigation } from "@/composables/useNavigation";

// Types e Interfaces
import type { IRouteMeta } from "@/models/model/IRouteMeta";

// Componentes
import DrawerItemUsuario from "./fixtures/DrawerItemUsuario.vue";
import DrawerItemNavigation from "@/components/layouts/base/navigation/fixtures/DrawerItemNavigation.vue";

// Stores
const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();

// Composables
const { menuItems, rotaAtualCorrespondeItem } = useNavigation();
const { mdAndUp } = useDisplay();
const { t } = useI18n();
const router = useRouter();

// Funções
function handleLogout() {
  authStore.logout();
  router.push({ name: "Login" });
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

// Computadas
const isDrawerVisible = computed({
  get: () => preferencesStore.preferences.drawer.isDesktopDrawerVisible,
  set: (val) => preferencesStore.setDesktopDrawerVisible(val),
});

const isPinned = computed(
  () => preferencesStore.preferences.drawer.isDrawerPinned,
);

const navItems = computed(() => menuItems.value);
</script>
