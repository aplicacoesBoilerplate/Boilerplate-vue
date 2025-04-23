<template>
  <v-app-bar app flat color="black">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('toggle')">
        <v-icon color="white">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
    </template>

    <RouterLink to="/dashboard" custom v-slot="{ navigate }">
      <v-app-bar-title @click="navigate" class="cursor-pointer d-flex justify-center">
        Tasks control
      </v-app-bar-title>
    </RouterLink>

    <div class="d-flex justify-space-around">
      <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon color="primary" v-bind="props">
            <v-icon color="white">mdi-book-open-page-variant-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="page in pages" :key="page.title">
            <RouterLink :to="page.path" custom v-slot="{ navigate }">
              <v-btn class="menu-btn" color="black" block @click="navigate">
                <v-icon class="mr-2" color="white">{{ page.icon }}</v-icon>
                <span class="text-white">{{ page.title }}</span>
              </v-btn>
            </RouterLink>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="d-flex justify-space-around">
      <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon color="primary" v-bind="props">
            <v-icon color="white">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="page in optionConfig" :key="page.title">
            <RouterLink :to="page.path" custom v-slot="{ navigate }">
              <v-btn class="menu-btn" color="black" block @click="navigate">
                <v-icon class="mr-2" color="white">{{ page.icon }}</v-icon>
                <span class="text-white">{{ page.title }}</span>
              </v-btn>
            </RouterLink>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <template v-slot:append>
      <v-btn icon @click="openSearch()">
        <v-icon color="white">mdi-magnify</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang=ts>
import { ref } from 'vue';
import { useDialogStoreSearch } from './dialog/dialogSearch/dialogStoreSearch'

const dialogStoreSearch = useDialogStoreSearch()

function openSearch() {
  dialogStoreSearch.openSearchDialog()
}

const pages = ref([
  { title: 'Home', path: '/dashboard', icon: 'mdi-home-outline' },
  { title: 'About', path: '/about', icon: 'mdi-information-outline' },
  { title: 'Regiter', path: '/register', icon: 'mdi-account-plus-outline' },
])

const optionConfig = ref([
  { title: 'Report', path: '/report', icon: 'mdi-chart-bar' },
  { title: 'Config', path: '/config', icon: 'mdi-cog-outline' },
  { title: 'Profile', path: '/profile', icon: 'mdi-account-cog' },
])

// Não remover
const props = defineProps<{
  collapse: boolean
}>()

// Não remover
const emit = defineEmits<{
  (e: 'toggle'): void
}>()

</script>
