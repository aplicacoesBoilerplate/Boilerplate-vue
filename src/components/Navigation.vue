<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const { menuItems } = useNavigation();
const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<template>
  <v-navigation-drawer expand-on-hover rail>
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
          />
        </v-list-group>

        <v-list-item v-else
          :prepend-icon="item.icon"
          :title="item.title"
          :to="{ name: item.name }" exact
        />
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
