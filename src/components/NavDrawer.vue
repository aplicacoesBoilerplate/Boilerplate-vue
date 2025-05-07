<template>
  <v-navigation-drawer v-model="modelValue" app>
    <div class="d-flex flex-column fill-height">
      <div>
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
      </div>
      <div class="mt-auto pa-4">
        <RouterLink to="/" custom v-slot="{ navigate }">
          <v-btn class="menu-btn" color="black" block @click="navigate">
            <v-icon class="mr-2" color="white">mdi-logout</v-icon>
            <span class="text-white">Logout</span>
          </v-btn>
        </RouterLink>
      </div>
    </div>
  </v-navigation-drawer>
  <DialogNewTask />
</template>

<script setup lang="ts">
//#region hidden
import { computed, ref } from 'vue'
import DialogNewTask from './dialog/dialogTask/DialogTask.vue'
import { useDialogStoreTask } from './dialog/dialogTask/dialogStoreTask'

const dialogStoreNewTask = useDialogStoreTask()

function openNewTask() {
  dialogStoreNewTask.startCreatingNewTask()
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

//#endregion

const routerOption = ref([
  // { id: '0', icon: 'mdi-', path: '/', title: '' },
  { id: '1', icon: 'mdi-file-tree', path: '/tasks', title: 'View all tasks' },
  { id: '2', icon: 'mdi-account-group', path: '/users', title: 'View all users' },
])

</script>
