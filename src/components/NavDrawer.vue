<template>
  <v-navigation-drawer v-model="modelValue" app>
    <v-card class="mx-auto" max-width="300">
      <v-list density="compact">
        <v-list-subheader>ROUTERS</v-list-subheader>

        <v-list-item color="primary">
          <v-btn class="menu-btn" color="black" block @click="openNewTask()">
            <v-icon class="mr-2" color="white">mdi-plus-circle-outline</v-icon>
            <span class="text-white">Create a new task</span>
          </v-btn>
        </v-list-item>

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
import DialogNewTask from './dialog/dialogNewTask/DialogNewTask.vue'
import { useDialogStoreNewTask } from './dialog/dialogNewTask/dialogStoreNewTask'

const dialogStoreNewTask = useDialogStoreNewTask()

function openNewTask() {
  dialogStoreNewTask.openNewTaskDialog()
}

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
  { id: '2', icon: 'mdi-file-tree', path: '/tasks', title: 'View all tasks' },
])

</script>
