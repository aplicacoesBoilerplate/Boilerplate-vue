<template>
  <v-navigation-drawer v-model="collapse" app>
    <div class="d-flex flex-column fill-height">
      <div>
        <v-card class="mx-auto" max-width="300">
          <v-list density="compact">
            <v-list-subheader>ROTINAS</v-list-subheader>

            <div v-for="router in routerOption" :key="router.id">
              <v-list-item color="primary" v-if="disabledRouterOption(router.path)">
                <RouterLink :to="router.path" custom v-slot="{ navigate }">
                  <v-btn class="menu-btn position-relative d-flex justify-center align-center" color="black" block
                    @click="navigate" :title="router.title">
                    <!-- Ícone fixo na esquerda -->
                    <v-icon class="position-absolute" style="left: 16px; top: 50%; transform: translateY(-50%);"
                      color="white">
                      {{ router.icon }}
                    </v-icon>

                    <!-- Texto centralizado -->
                    <span class="text-white" style="z-index: 1;">
                      {{ router.title }}
                    </span>
                  </v-btn>
                </RouterLink>
              </v-list-item>
            </div>
          </v-list>
        </v-card>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
//#region hidden
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';
import { authServices } from '@/services/authService';
import { onBeforeMount, ref } from 'vue'

const collapse = defineModel('collapse', { type: Boolean, required: true })
const usuario = ref<UsuarioConsulta>()

onBeforeMount(async () => {
  usuario.value = await authServices.getByToken();
})

//#endregion

const routerOption = ref([
  // { id: '0', icon: 'mdi-', path: '/', title: '' },
  { id: '1', icon: 'mdi-home-circle', path: '/dashboard', title: 'Início' },
  { id: '2', icon: 'mdi-camera-front-variant', path: '/saidas', title: 'Saídas' },
  { id: '3', icon: 'mdi-lock-check', path: '/autorizacoes', title: 'Autorizações' },
  { id: '4', icon: 'mdi-list-box-outline', path: '/motivos', title: 'Motivos' },
  { id: '5', icon: 'mdi-bookmark-multiple-outline', path: '/categorias', title: 'Categorias' },
  { id: '6', icon: 'mdi-account-group', path: '/users', title: 'Usuários' },
  { id: '7', icon: 'mdi-door-sliding', path: '/portaria', title: 'Portaria' },
  { id: '8', icon: 'mdi-alert-circle-outline', path: '/errors', title: 'Errors' },
])

function disabledRouterOption(path: string): boolean {

  const showRouter = ref(false) // Começa bloqueado para não correr o risco de expor todos os componentes se caso perder o usuário autenticado

  switch (path) {
    case '/dashboard': showRouter.value = true
    case '/saidas': { // Apenas a portaria não pode acessar as rotas de saída
      if (usuario.value?.permissao == 'PORTARIA') {
        showRouter.value = false
      }
      else
        showRouter.value = true
      break
    }
    case '/autorizacoes': { // Além dos admins, quem emite autorização também pode acessar este recurso
      if (usuario.value?.permissao == 'ADMINISTRADOR' || usuario.value?.permissao == 'ADMINISTRADOR_AUTORIZADO' || usuario.value?.permissao == 'EMITE_AUTORIZACAO' || usuario.value?.autorizaSaida) {
        showRouter.value = true
      } else
        showRouter.value = false
      break
    }
    case '/motivos': { // Qualquer autenticado pode acessar os motivos, mas bloqueia para portaria apenas por ser conveniente
      if (usuario.value?.permissao == 'PORTARIA')
        showRouter.value = false
      else
        showRouter.value = true
      break
    }
    case '/categorias': { // Apenas quem emite saída, todos, exceto a portaria
      if (usuario.value?.permissao == 'PORTARIA')
        showRouter.value = false
      else
        showRouter.value = true
      break
    }
    case '/users': { // Apenas admins podem acessar os usuários
      if (usuario.value?.permissao == 'ADMINISTRADOR' || usuario.value?.permissao == 'ADMINISTRADOR_AUTORIZADO') {
        showRouter.value = true
      } else
        showRouter.value = false
      break
    }
    case '/portaria': { // Apenas a portaria pode acessar as rotas de portaria
      if (usuario.value?.permissao == 'PORTARIA') {
        showRouter.value = true
      }
      else
        showRouter.value = false
      break
    }
    case '/errors': { // Apenas admins podem acessar o histórico de erros
      if (usuario.value?.permissao == 'ADMINISTRADOR' || usuario.value?.permissao == 'ADMINISTRADOR_AUTORIZADO') {
        showRouter.value = true
      } else
        showRouter.value = false
      break
    }
    case '/sgbd': { // Apenas admins podem acessar o SGBD
      if (usuario.value?.permissao == 'ADMINISTRADOR' || usuario.value?.permissao == 'ADMINISTRADOR_AUTORIZADO') {
        showRouter.value = true
      } else
        showRouter.value = false
      break
    }
    default: {
      showRouter.value = false
    }
  }

  return showRouter.value
}
</script>
