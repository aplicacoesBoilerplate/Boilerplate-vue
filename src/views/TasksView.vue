<template>
  <div class="pb-2 custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">

    <v-btn icon @click="openNewTask()" class="animated-btn">
      <v-icon :class="{ rotate: hover }" color="white">mdi-plus-circle-outline</v-icon>
    </v-btn>
    <span class="button-label" :class="{ visible: hover }">Create a new task</span>

  </div>
  <DialogNewTask />

  <div v-if="apiTasks.length == 0" class="pt-4">
    <v-alert text="Before viewing the tasks, you must register them and they will then be available below."
      title="No tasks registered!" type="info" variant="tonal">
    </v-alert>
  </div>

  <v-card v-else class="mx-auto" max-width="700">

    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Task List</span>
      <v-text-field clearable v-model="idSearch" density="compact" variant="outlined"
        placeholder="Search task by register" hide-details prepend-inner-icon="mdi-magnify" style="max-width: 300px" />
    </v-card-title>
    <v-divider />

    <v-virtual-scroll :items="apiTasks" height="500" item-height="50">
      <template v-slot:default="{ item: task }">
        <v-list-item :title="`Employee - ${task.employeeName.toUpperCase()}`"
          :subtitle="`#${task.id} title: ${task.title}`">

          <template v-slot:prepend>
            <v-icon>mdi-list-box-outline</v-icon>
          </template>

          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="dark" icon="mdi-information-outline"
                @click="toggleTask(task.id!)">
              </v-btn>
            </div>

            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn size="small" color="primary" v-bind="props" icon="mdi-dots-vertical" />
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                      @click="completeFormEditTaskDialog(task)" />
                    <span class="pr-2" />

                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteTask(task.id!)" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
        <!-- expand panel -->
        <v-expand-transition>
          <div v-if="expandedTaskId === task.id" class="custom-expansion-panel">
            <v-row>

              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="getStatusColor(task.status)">
                  {{ task.status }}
                </v-chip>
              </v-col>

              <v-col sm="9" md="10">
                <strong>Description:</strong> {{ task.description }}<br>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="6" class="d-flex justify-center">
                <strong>Estimated delivery:</strong>
                {{ new Date(task.estimatedDelivery).toLocaleString() || 'Not set' }}<br>
              </v-col>

              <v-divider vertical class="border-opacity-100" :color="getStatusColor(task.status)" />

              <v-col sm="6" class="d-flex justify-center">
                <strong>Date delivery:</strong> {{ new Date(task.dateDelivery).toLocaleString() || 'Not set' }}<br>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script setup lang=ts>
import DialogNewTask from '@/components/dialog/dialogTask/DialogTask.vue'
import { useDialogStoreTask } from '@/components/dialog/dialogTask/dialogStoreTask'

import type { Task } from '@/models/TaskModel'
import { onMounted, ref, watch } from 'vue';
import { todoServices } from '@/services/todoService';

const idSearch = ref<number | string>()
const expandedTaskId = ref<number | null>(null)
const hover = ref(false)
const dialogStoreTask = useDialogStoreTask()
const todoService = todoServices()
var apiTasks = dialogStoreTask.apiTasks;

function openNewTask() {
  dialogStoreTask.startCreatingNewTask()
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending':
      return 'grey'
    case 'In progress':
      return 'blue'
    case 'Test':
      return 'purple'
    case 'Review':
      return 'orange'
    case 'Completed':
      return 'green'
    case 'Rejected':
      return 'red'
    default:
      return 'default'
  }
}

function completeFormEditTaskDialog(task: Task) {
  dialogStoreTask.completeFormEditTaskDialog(task)
}

async function deleteTask(idTask: number) {

}

function toggleTask(id: number) {
  expandedTaskId.value = expandedTaskId.value === id ? null : id
}

async function getAllTasks() {
  apiTasks.value = await todoService.getAllTasks();
}

async function getTaskById(idTask: number | string) {
  const task = await todoService.getTaskById(idTask)
  apiTasks.value = [task]
}

onMounted(async () => {
  await getAllTasks()
});

watch(() => idSearch.value, (newValue) => {
  if (newValue !== null && newValue !== '')
    getTaskById(newValue!)
  else
    getAllTasks();
})


function useDialogStoreConfirmarSenha() {
  throw new Error('Function not implemented.');
}
</script>

<style scoped>
.wrap-text {
  white-space: normal;
  word-break: break-word;
}

.custom-expansion-panel {
  margin: 0.8rem;
}

.custom-expansion-panel,
strong {
  padding-right: 0.5rem;
  text-decoration: none;
}
</style>
