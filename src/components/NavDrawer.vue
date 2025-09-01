<template>
  <v-navigation-drawer v-model="modelValue" app>
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
import { usuarioAutenticado } from '@/stores/usuarioAutenticado';
import { computed, ref } from 'vue'

const props = defineProps<{
  collapse: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapse', value: boolean): void
}>()

const modelValue = computed({
  get: () => props.collapse,
  set: value => emit('update:collapse', value)
})

//#endregion

const routerOption = ref([
  // { id: '0', icon: 'mdi-', path: '/', title: '' },
  { id: '1', icon: 'mdi-camera-front-variant', path: '/saidas', title: 'Saídas' },
  { id: '2', icon: 'mdi-lock-check', path: '/autorizacoes', title: 'Autorizações' },
  { id: '3', icon: 'mdi-list-box-outline', path: '/motivos', title: 'Motivos' },
  { id: '4', icon: 'mdi-bookmark-multiple-outline', path: '/categorias', title: 'Categorias' },
  { id: '5', icon: 'mdi-account-group', path: '/users', title: 'Usuários' },
  { id: '6', icon: 'mdi-door-sliding', path: '/portaria', title: 'Portaria' },
  { id: '7', icon: 'mdi-alert-circle-outline', path: '/errors', title: 'Errors' },
])

function disabledRouterOption(path: string): boolean {

  const showRouter = ref(false) // Começa bloqueado para não correr o risco de expor todos os componentes se caso perder o usuário autenticado
  const usuario = usuarioAutenticado().usuario
  const permissao = usuarioAutenticado().usuario.permissao

  switch (path) {
    case '/saidas': { // Apenas a portaria não pode acessar as rotas de saída
      if (usuario.permissao == 'PORTARIA') {
        showRouter.value = false
      }
      else
        showRouter.value = true
      break
    }
    case '/autorizacoes': { // Além dos admins, quem emite autorização também pode acessar este recurso
      if (usuario.permissao == 'ADMINISTRADOR' || usuario.permissao == 'ADMINISTRADOR_AUTORIZADO' || usuario.permissao == 'EMITE_AUTORIZACAO' || usuario.autorizaSaida) {
        showRouter.value = true
      } else
        showRouter.value = false
      break
    }
    case '/motivos': { // Qualquer autenticado pode acessar os motivos, mas bloqueia para portaria apenas por ser conveniente
      if (usuario.permissao == 'PORTARIA')
        showRouter.value = false
      else
        showRouter.value = true
      break
    }
    case '/categorias': { // Apenas quem emite saída, todos, exceto a portaria
      if (usuario.permissao == 'PORTARIA')
        showRouter.value = false
      else
        showRouter.value = true
      break
    }
    case '/users': { // Apenas admins podem acessar os usuários
      if (usuario.permissao == 'ADMINISTRADOR' || usuario.permissao == 'ADMINISTRADOR_AUTORIZADO') {
        showRouter.value = true
      } else
        showRouter.value = false
      break
    }
    case '/portaria': { // Apenas a portaria pode acessar as rotas de portaria
      if (usuario.permissao == 'PORTARIA') {
        showRouter.value = true
      }
      else
        showRouter.value = false
      break
    }
    case '/errors': { // Apenas admins podem acessar o histórico de erros
      if (usuario.permissao == 'ADMINISTRADOR' || usuario.permissao == 'ADMINISTRADOR_AUTORIZADO') {
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
