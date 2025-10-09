<template>
  <v-app-bar app flat color="black">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('toggle')" title="Recursos">
        <v-icon color="white">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
    </template>

    <RouterLink to="/dashboard" custom v-slot="{ navigate }">
      <v-app-bar-title @click="navigate" class="d-flex justify-center text-center">
        CONTROLE DE SAÍDAS <br></br>
        {{ usuarioLogado?.nome ?? '' }}
      </v-app-bar-title>
    </RouterLink>

    <!-- ícone do indicador de inatividade -->
    <div class="d-flex justify-space-around timer"
      v-if="tempoRestante !== null && tempoRestante > 0 && loading === false">
      <v-icon class="mr-2"color="indigo-accent-2">
        mdi-timer-sand-complete
      </v-icon>
      {{ Math.floor(tempoRestante / 60) }}:{{ (tempoRestante % 60).toString().padStart(2, '0') }}
    </div>

    <!-- ícone do indicador para versão -->
    <div class="d-flex justify-space-around"
      v-if="usuarioLogado?.permissao?.includes('ADMINISTRADOR') && loading === false">
      <v-btn class="menu-btn" color="black" icon @click="openDialogVersion = true">
        <v-icon class="mr-2"color="indigo-accent-2">
          mdi-alpha-v-box-outline
        </v-icon>
      </v-btn>
    </div>

    <!-- ícone do indicador para verificar se o WhatsApp está online -->
    <div class="d-flex justify-space-around"
      v-if="usuarioLogado?.permissao?.includes('ADMINISTRADOR') && loading === false">
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

  <DialogVersao v-model:visualizar="openDialogVersion"/>
  <DialogQrcode v-model:qrcode="dialogQrcode" v-model:status="statusWhatsApp"/>
</template>

<script setup lang=ts>
// Componentes
import DialogQrcode from './dialog/dialogQrcode/DialogQrcode.vue';
import DialogVersao from './dialog/dialogVersao/DialogVersao.vue';

// Models
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Services
import { wppConnectionServices } from '@/services/wppConnectionServices';
import { authServices } from '@/services/authService';
import { useRouter } from 'vue-router'

// Vue
import { onMounted, ref } from 'vue';
import { useInatividadeStore } from '@/stores/inatividade';
import { storeToRefs } from 'pinia';

const redirectRouter = useRouter()
const usuarioLogado = ref<UsuarioConsulta>() // Armazenar o usuário autenticado
const statusWhatsApp = ref<boolean>(false) // Controla o status do WhatsApp
const loading = ref(false) // Controla o status do Loading
const openDialogVersion = ref(false)
const dialogQrcode = ref<{ visualizar: boolean, qrcode: string }>({visualizar: false, qrcode: ''})

const inatividadeStore = useInatividadeStore();
const { tempoRestante } = storeToRefs(inatividadeStore);

// Se o usuário armazenado estiver vazio e o token ainda estiver no session store, consultar o usuário da sessão ao montar o componente
onMounted(async () => {
  try {
        const responseByToken = await authServices.getByToken();
        usuarioLogado.value = responseByToken;

        if (responseByToken) {
            if (usuarioLogado.value.permissao === 'ADMINISTRADOR' || usuarioLogado.value.permissao === 'ADMINISTRADOR_AUTORIZADO')
            try {
                await getStatusWppConnect();
            } catch (error) {
                useSnackbarStore().showSnackbar(error, 'red');
            }
        }

    } catch (error) {
        useSnackbarStore().showSnackbar('Erro ao identificar o usuário! Redirecionando para a tela de login...', 'red')
        setTimeout(() => {
            redirectRouter.push('/')
        }, 3000);
    }
})

function logout() {
  authServices.logout()
  redirectRouter.push('/');
}

// #region Status WhatsApp
async function getStatusWppConnect() {
  loading.value = true
  try {
    const data = await wppConnectionServices.getStatusWppConnect();
    statusWhatsApp.value = data
    if (!data) {
      await getQrcodeWppConnect()
    } else {
        dialogQrcode.value.visualizar = true
    }
  } catch (error) {
    useSnackbarStore().showSnackbar('WhatsApp offline! Escaneie o qrcode para se conectar.', 'warning')
    statusWhatsApp.value = false
    throw error
  } finally {
    loading.value = false
  }
}

async function getQrcodeWppConnect() {
  try {
    const data = await wppConnectionServices.startSessionWppConnect();
    await openQrCode(data.qrcode);
  } catch (error) {
    useSnackbarStore().showSnackbar('Não foi possível gerar o qrcode para se conectar ao WhatsApp! Aguarde alguns minutos enquanto o sistema prepara uma nova sessão...', 'red')
  }
}

async function openQrCode(qrcode: string) {
  dialogQrcode.value.qrcode = qrcode
  dialogQrcode.value.visualizar = true
}

// #endregion

</script>

<style scoped>
.timer {
  color: red;
  font-size: xx-small;
  padding: 0;
  margin: 0;
}
</style>
