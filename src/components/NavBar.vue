<template>
  <v-app-bar app flat color="black">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('toggle')" title="Recursos">
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
        <v-btn class="menu-btn" color="black" icon @click="navigate" title="Perfil">
          <v-icon class="mr-2" color="white">mdi-account-cog</v-icon>
        </v-btn>
      </RouterLink>
    </div>

    <!-- Botão de logout -->
    <div class="d-flex justify-space-around">
      <v-btn class="menu-btn" color="black" icon @click="logout()" title="Sair do sistema">
        <v-icon class="mr-2" color="white">mdi-logout</v-icon>
      </v-btn>
    </div>

  </v-app-bar>
  <DialogSearch v-model:exibir="showDialogSearch" />
</template>

<script setup lang=ts>
// Componentes
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

// Se o usuário armazenado estiver vazio e o token ainda estiver no session store, consultar o usuário da sessão ao montar o componente
onMounted(async () => {
  if (!!usuarioLogado.usuario && sessionStorage.getItem('token') !== '')
    usuarioLogado.usuario = await authServices().getByToken()
  else
    useSnackbarStore().showSnackbar('Usuário não identificado!', 'red')
})

function logout() {
  authServices().logout()
  redirectRouter.push('/');
}

// Propriedade da barra de navegação que controla a exibição da side bar
const props = defineProps<{
  collapse: boolean
}>()

// Evento da barra de navegação que abre\fecha a side bar
const emit = defineEmits<{
  (e: 'toggle'): void
}>()

</script>
