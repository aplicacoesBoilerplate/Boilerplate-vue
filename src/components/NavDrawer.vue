<template>
  <v-navigation-drawer v-model="modelValue" app>
    <v-card class="mx-auto" max-width="300">
      <v-list density="compact">
        <v-list-subheader>ROUTERS</v-list-subheader>

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
  </v-navigation-drawer>
</template>

<script setup lang="ts">
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

const routerOption = ref([
  // { id: '0', icon: 'mdi-', path: '/', title: '' },
  { id: '1', icon: 'mdi-file-tree', path: '/tasks', title: 'View all tasks' },
])

</script>
