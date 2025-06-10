<template>
  <v-navigation-drawer v-model="modelValue" app>
    <div class="d-flex flex-column fill-height">
      <div>
        <v-card class="mx-auto" max-width="300">
          <v-list density="compact">
            <v-list-subheader>ROTINAS</v-list-subheader>

            <v-list-item v-for="router in routerOption" :key="router.id" color="primary">
              <RouterLink :to="router.path" custom v-slot="{ navigate }">
                <v-btn class="menu-btn position-relative d-flex justify-center align-center" color="black" block
                  @click="navigate" :title="router.title" :disabled="disabledRouterOption(router.path)">
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
  { id: '4', icon: 'mdi-account-group', path: '/users', title: 'Usuários' },
  { id: '5', icon: 'mdi-door-sliding', path: '/portaria', title: 'Portaria' },
  { id: '6', icon: 'mdi-alert-circle-outline', path: '/errors', title: 'Errors' },
])

function disabledRouterOption(path: string): boolean {

  const disabledRouter = ref(true) // Começa bloqueado para não correr o risco de expor todos os componentes se caso perder o usuário autenticado
  const permissao = usuarioAutenticado().usuario.permissao

  switch (path) {
    case '/saidas': { // Apenas a portaria não pode acessar as rotas de saída
      if (permissao == 'PORTARIA') {
        disabledRouter.value = true
      }
      else
        disabledRouter.value = false
      break
    }
    case '/autorizacoes': { // Além dos admins, quem emite autorização também pode acessar este recurso
      if (permissao == 'ADMINISTRADOR' || permissao == 'ADMINISTRADOR_AUTORIZADO' || permissao == 'EMITE_AUTORIZACAO') {
        disabledRouter.value = false
      } else
        disabledRouter.value = true
      break
    }
    case '/motivos': { // Qualquer autenticado pode acessar os motivos
      if (!!permissao)
        disabledRouter.value = false
      else
        disabledRouter.value = true
      break
    }
    case '/users': { // Apenas admins podem acessar os usuários
      if (permissao == 'ADMINISTRADOR' || permissao == 'ADMINISTRADOR_AUTORIZADO') {
        disabledRouter.value = false
      } else
        disabledRouter.value = true
      break
    }
    case '/portaria': { // Apenas a portaria pode acessar as rotas de portaria
      if (permissao == 'PORTARIA') {
        disabledRouter.value = false
      }
      else
        disabledRouter.value = true
      break
    }
    case '/errors': { // Apenas admins podem acessar o histórico de erros
      if (permissao == 'ADMINISTRADOR' || permissao == 'ADMINISTRADOR_AUTORIZADO') {
        disabledRouter.value = false
      } else
        disabledRouter.value = true
      break
    }
    default: {
      disabledRouter.value = true
    }
  }

  return disabledRouter.value
}

</script>
