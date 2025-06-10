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
            ? `CONTROLE DE SAÍDAS - ${usuarioLogado.usuario.nome}`
            : 'CONTROLE DE SAÍDAS'
        }}
      </v-app-bar-title>
    </RouterLink>


    <!-- Botão de perfil -->
    <div class="d-flex justify-space-around">
      <RouterLink to="/profile" custom v-slot="{ navigate }">
        <v-btn class="menu-btn" color="black" icon @click="navigate">
          <v-icon class="mr-2" color="white">mdi-account-cog</v-icon>
        </v-btn>
      </RouterLink>
    </div>


    <!-- Botão de logout -->
    <div class="d-flex justify-space-around">
      <v-btn class="menu-btn" color="black" icon @click="logout()">
        <v-icon class="mr-2" color="white">mdi-logout</v-icon>
      </v-btn>
    </div>

  </v-app-bar>
  <DialogSearch v-model:exibir="showDialogSearch" />
  <SnackbarNotifications />
  <!-- <BtnsNavigation /> -->
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
import { useRouter } from 'vue-router'
// Vue
import { onMounted, ref } from 'vue';

const redirectRouter = useRouter()
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

function logout() {
  authServices().logout()
  redirectRouter.push('/');
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
