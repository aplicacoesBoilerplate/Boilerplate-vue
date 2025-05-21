<template>
  <v-app-bar app flat color="black">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('toggle')">
        <v-icon color="white">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
    </template>

    <RouterLink to="/dashboard" custom v-slot="{ navigate }">
      <v-app-bar-title @click="navigate" class="cursor-pointer d-flex justify-center">
        {{
          usuarioLogado.usuario.nome != ''
            ? `Controle de saídas - ${usuarioLogado.usuario.nome}`
            : 'Controle de saídas'
        }}
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
  <DialogSearch v-model:exibir="showDialogSearch" />
  <SnackbarNotifications />
  <BtnsNavigation />
</template>

<script setup lang=ts>
// Componentes
import SnackbarNotifications from './Snackbar.vue';
import DialogSearch from './dialog/DialogSearch.vue';
// Store
import { usuarioAutenticado } from '@/stores/usuarioAutenticado';
import { useSnackbarStore } from '@/stores/SnackbarStore';
// Services
import { authServices } from '@/services/authService';
// Vue
import { onMounted, ref } from 'vue';
import BtnsNavigation from '@/components/BtnsNavigation.vue';

const usuarioLogado = usuarioAutenticado() // Armazenar o usuário autenticado
const showDialogSearch = ref(false) // Exibir dialog de consulta

// Se o usuário armazenado estiver vazio consultar o usuário da sessão ao montar o componente
onMounted(async () => {
  if (!!usuarioLogado.usuario && sessionStorage.getItem('token') !== '')
    usuarioLogado.usuario = await authServices().getByToken()
  else
    useSnackbarStore().showSnackbar('Usuário não identificado!', 'red')
})

// Função para controlar a exibição do dialog de consulta geral
function openSearch() {
  // useDialogStoreSearch().openSearchDialog()

  showDialogSearch.value = true
}

// Páginas no bloco de utilidades
const pages = ref([
  { title: 'Home', path: '/dashboard', icon: 'mdi-home-outline' },
])

// Paginas no bloco de configurações
const optionConfig = ref([
  { title: 'Profile', path: '/profile', icon: 'mdi-account-cog' },
])

// Propriedade da barra de navegação que controla a exibição da side bar
const props = defineProps<{
  collapse: boolean
}>()

// Evento da barra de navegação que abre\fecha a side bar
const emit = defineEmits<{
  (e: 'toggle'): void
}>()

</script>
