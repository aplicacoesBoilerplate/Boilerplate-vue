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

    <!-- ícone do indicador para versão -->
    <div class="d-flex justify-space-around"
      v-if="usuarioLogado.usuario.permissao?.includes('ADMINISTRADOR') && loading === false">
      <v-btn class="menu-btn" color="black" icon @click="openDialogVersion = true">
        <v-icon class="mr-2"color="indigo-accent-2">
          mdi-alpha-v-box-outline
        </v-icon>
      </v-btn>
    </div>

    <!-- ícone do indicador para verificar se o WhatsApp está online -->
    <div class="d-flex justify-space-around"
      v-if="usuarioLogado.usuario.permissao?.includes('ADMINISTRADOR') && loading === false">
      <v-btn class="menu-btn" color="black" icon @click="getStatusWppConnect()"
        :title="`Status WhatsApp: ${statusWhatsApp ? 'Online' : 'Offline'}`">
        <v-icon class="mr-2" :color="statusWhatsApp ? 'success' : 'red'">mdi-whatsapp</v-icon>
      </v-btn>
    </div>

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

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

  <DialogVersao ref="dialogVersionRef" v-model:visualizar="openDialogVersion"/>
</template>

<script setup lang=ts>
// Componentes
import DialogVersao from './dialog/dialogVersao/DialogVersao.vue';

// Store
import { usuarioAutenticado } from '@/stores/usuarioAutenticado';
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Services
import { authServices } from '@/services/authService';
import { useRouter } from 'vue-router'
import http from '@/services/axios'

// Vue
import { onMounted, ref } from 'vue';

const redirectRouter = useRouter()
const usuarioLogado = usuarioAutenticado() // Armazenar o usuário autenticado
const statusWhatsApp = ref(false) // Controla o status do WhatsApp
const loading = ref(false) // Controla o status do Loading
const dialogVersionRef = ref()
const openDialogVersion = ref(false)

// Se o usuário armazenado estiver vazio e o token ainda estiver no session store, consultar o usuário da sessão ao montar o componente
onMounted(async () => {
  if (!!usuarioLogado.usuario && sessionStorage.getItem('token') !== '')
    usuarioLogado.usuario = await authServices().getByToken()
  else
    useSnackbarStore().showSnackbar('Usuário não identificado!', 'red')
  if (usuarioLogado.usuario.permissao === 'ADMINISTRADOR' || usuarioLogado.usuario.permissao === 'ADMINISTRADOR_AUTORIZADO')
    await getStatusWppConnect();
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

// #region Status WhatsApp

async function getStatusWppConnect(): Promise<boolean> {
  loading.value = true
  try {
    const { data } = await http.get('/whatsapp/status')
    statusWhatsApp.value = data
    return data
  } catch (error) {
    statusWhatsApp.value = false
    throw error
  } finally {
    loading.value = false
  }
}

// #endregion

</script>
