<template>
  <v-app-bar app flat :collapse="collapseAppBar" color="black">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="alterToggle()">
        <v-icon color="white">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Application Bar</v-app-bar-title>

    <div class="d-flex justify-space-around">
      <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props">
            <v-icon color="white">mdi-book-open-page-variant-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title">
            <RouterLink :to="item.path" custom v-slot="{ navigate }">
              <v-btn class="menu-btn" color="black" block @click="navigate">
                <v-icon class="mr-2" color="white">{{ item.icon }}</v-icon>
                <span class="text-white">{{ item.title }}</span>
              </v-btn>
            </RouterLink>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <template v-slot:append>
      <RouterLink to="/" custom v-slot="{ navigate }">
        <v-btn icon @click="navigate">
          <v-icon color="white">mdi-heart</v-icon>
        </v-btn>
      </RouterLink>

      <v-btn icon @click="openSearch">
        <v-icon color="white">mdi-magnify</v-icon>
      </v-btn>

      <RouterLink to="/login/register" custom v-slot="{ navigate }">
        <v-btn icon @click="navigate">
          <v-icon color="white">mdi-dots-vertical</v-icon>
        </v-btn>
      </RouterLink>
    </template>
  </v-app-bar>
</template>

<script setup lang=ts>
import { ref } from 'vue';
import { useDialogStore } from './dialogSearch/dialogStore'
const dialogStore = useDialogStore()

function openSearch() {
  dialogStore.openSearchDialog()
}

const items = ref([
  { title: 'Home', path: '/dashboard', icon: 'mdi-home-outline' },
  { title: 'About', path: '/about', icon: 'mdi-information-outline' },
  { title: 'Regiter', path: '/register', icon: 'mdi-account-plus-outline' }
])

var collapseAppBar = ref(false);

function alterToggle() {
  collapseAppBar.value = !collapseAppBar.value;
}
</script>

<style scoped>
.menu-btn {
  width: 200px;
  justify-content: start;
  text-transform: none;
}
</style>
