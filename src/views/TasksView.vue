<template>
  <v-btn icon @click="openNewTask()">
    <v-icon color="white">mdi-plus-circle-outline</v-icon>
  </v-btn>
  <DialogNewTask />

  <div style="padding-top: 1.5rem;">
    <v-row dense>
      <v-expansion-panels>
        <v-expansion-panel v-for="task in apiTasks" :key="task.id">
          <v-expansion-panel-title v-slot="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="4">
                <v-chip>
                  {{ task.id }} - {{ task.title }}
                </v-chip>
              </v-col>
              <v-col class="text--secondary" cols="8">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded">
                    <v-row style="width: 100%" no-gutters>
                      <v-col class="d-flex justify-start" cols="6">
                        <v-chip>
                          Employee: {{ task.idEmployee || 'Not set' }}
                        </v-chip>
                      </v-col>
                      <v-col class="d-flex justify-start" cols="6">
                        <v-chip :color="getStatusColor(task.status)">
                          {{ task.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </span>
                  <v-row v-else style="width: 100%" no-gutters>
                    <v-col class="d-flex justify-start" cols="6">
                      <v-chip>
                        Estimated delivery: {{ task.estimatedDelivery }}
                      </v-chip>
                    </v-col>
                    <v-col class="d-flex justify-start" cols="6">
                      <v-chip :color="getStatusColor(task.status)">
                        {{ task.status }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-row style="padding-bottom: 1rem;">
              <v-col cols="12" class="wrap-text">
                Description: {{ task.description || 'Not set' }}
              </v-col>
              <v-col cols="12" class="wrap-text">
                Estimated delivery: {{ task.estimatedDelivery || 'Not set' }}
              </v-col>
              <v-col cols="12" class="wrap-text">
                Date delivery: {{ task.dateDelivery || 'Not set' }}
              </v-col>
              <v-col cols="12" class="wrap-text">
                Employee name: {{ task.employeeName || 'Not set' }}
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col sm="12" md="6" style="padding-top: 0.5rem">
                <v-btn color="primary" block @click="completeFormEditTaskDialog(task)">
                  <v-icon>
                    mdi-pencil-outline
                  </v-icon>
                </v-btn>
              </v-col>

              <v-col sm="12" md="6" style="padding-top: 0.5rem">
                <v-btn color="red" block @click="deleteTask(task.id!)">
                  <v-icon>
                    mdi-delete-outline
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>

          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script setup lang=ts>
import DialogNewTask from '@/components/dialog/dialogTask/DialogTask.vue'
import { useDialogStoreTask } from '@/components/dialog/dialogTask/dialogStoreTask'
import type { Task } from '@/models/TaskModel'
import { onMounted } from 'vue';
import { todoServices } from '@/services/todoService';

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

async function deleteTask(id: number) {
  await dialogStoreTask.deleteTask(id);
  apiTasks.value = await todoService.getAllTasks();
}

onMounted(async () => {
  try {
    apiTasks.value = await todoService.getAllTasks();
  } catch (error) {
    throw error
  }
});

</script>

<style scoped>
.wrap-text {
  white-space: normal;
  word-break: break-word;
}
</style>
