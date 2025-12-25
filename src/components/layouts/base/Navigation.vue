<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useHotkey } from 'vuetify';

const { menuItems } = useNavigation();
const authStore = useAuthStore();
const router = useRouter();

const flattenMenuItems = (items: typeof menuItems.value): any[] => {
  return items.reduce((acc: any[], item) => {
    acc.push(item);
    if (item.children && item.children.length > 0) {
      acc.push(...flattenMenuItems(item.children));
    }
    return acc;
  }, []);
};

const allItems = flattenMenuItems(menuItems.value);

allItems.forEach((item) => {
  if (item.hotkey && item.name) {
    useHotkey(item.hotkey, () => {
      router.push({ name: item.name });
    });
  }
});

function handleLogout() {
  authStore.logout();
  router.push({ name: 'Login' });
}

</script>

<template>
  <v-navigation-drawer app expand-on-hover rail>
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :subtitle="authStore.user?.email"
        :title="authStore.user?.username"
      />
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <template v-for="item in menuItems" :key="item.path">
        <v-list-group
          v-if="item.children && item.children.length > 0"
          :value="item.name"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
          </template>

          <v-list-item v-for="child in item.children" :key="child.path"
            :prepend-icon="child.icon"
            :title="child.title"
            :to="{ name: child.name }" exact
          >
            <template v-slot:append v-if="item.hotkey">
              <v-hotkey
                :keys="child.hotkey"
                display-mode="icon"
                variant="contained"
                platform="auto"
              />
            </template>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else
          :prepend-icon="item.icon"
          :title="item.title"
          :to="{ name: item.name }" exact
        >
          <template v-slot:append v-if="item.hotkey">
            <v-hotkey
              :keys="item.hotkey"
              display-mode="icon"
              variant="contained"
              platform="auto"
            />
          </template>
        </v-list-item>
      </template>
    </v-list>

    <template v-slot:append>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          :to="{ name: 'Login' }"
          exact
          @click="handleLogout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
