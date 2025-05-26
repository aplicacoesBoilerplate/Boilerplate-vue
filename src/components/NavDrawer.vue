<template>
  <v-navigation-drawer v-model="modelValue" app>
    <div class="d-flex flex-column fill-height">
      <div>
        <v-card class="mx-auto" max-width="300">
          <v-list density="compact">
            <v-list-subheader>ROTINAS</v-list-subheader>

            <v-list-item v-for="router in routerOption" :key="router.id" color="primary">
              <RouterLink :to="router.path" custom v-slot="{ navigate }">
                <v-btn class="menu-btn" color="black" block @click="navigate">
                  <v-icon class="mr-2" color="white">{{ router.icon }}</v-icon>
                  <span class="text-white">{{ router.title }}</span>
                </v-btn>
              </RouterLink>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
      <div class="mt-auto pa-4">
        <v-btn class="menu-btn" color="black" block @click="logout()">
          <v-icon class="mr-2" color="white">mdi-logout</v-icon>
          <span class="text-white">Logout</span>
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
//#region hidden
import { computed, ref } from 'vue'
import { authServices } from '@/services/authService'
import { useRouter } from 'vue-router'

const redirectRouter = useRouter()

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

// Service do auth para logout
const authService = authServices()

function logout() {
  authService.logout()
  redirectRouter.push('/');
}

//#endregion

const routerOption = ref([
  // { id: '0', icon: 'mdi-', path: '/', title: '' },
  { id: '1', icon: 'mdi-camera-front-variant', path: '/saidas', title: 'Saídas' },
  { id: '2', icon: 'mdi-lock-check', path: '/autorizacoes', title: 'Autorizações' },
  { id: '3', icon: 'mdi-list-box-outline', path: '/motivos', title: 'Motivos' },
  { id: '4', icon: 'mdi-account-group', path: '/users', title: 'Usuários' },
  { id: '5', icon: 'mdi-door-sliding', path: '/portaria', title: 'Portaria' },
])
</script>
