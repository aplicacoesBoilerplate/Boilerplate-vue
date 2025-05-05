<template>
  <v-btn icon @click="openNewTask()">
    <v-icon color="white">mdi-plus-circle-outline</v-icon>
  </v-btn>
  <DialogNewTask />

  <div style="padding-top: 1.5rem;">
    <v-row dense>
      <v-expansion-panels>
        <v-expansion-panel v-for="task in cardsTasks" :key="task.id">
          <v-expansion-panel-title v-slot="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="4">
                <v-chip>
                  {{ task.title }}
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
            </v-row>

            <v-row justify="space-around" no-gutters>
              <v-col cols="3">
                <v-date-input clearable v-model="task.estimatedDelivery" label="Date estimated delivery" max-width="368"
                  hint="format: MM/DD/YYYY" persistent-hint />
              </v-col>

              <v-col cols="3">
                <v-date-input clearable v-model="task.dateDelivery" label="Date delivery" max-width="368"
                  hint="format: MM/DD/YYYY" persistent-hint />
              </v-col>

              <v-col cols="2" style="padding-top: 0.5rem">
                <v-btn color="primary" block @click="editTaskDialog(task)">
                  <v-icon>
                    mdi-pencil-outline
                  </v-icon>
                </v-btn>
              </v-col>

              <v-col cols="2" style="padding-top: 0.5rem">
                <v-btn color="red" block>
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
//#region hidden
import DialogNewTask from '@/components/dialog/dialogNewTask/DialogNewTask.vue'
import { useDialogStoreNewTask } from '@/components/dialog/dialogNewTask/dialogStoreNewTask'
import type { TaskDialog } from '@/models/TaskModel'

const dialogStoreNewTask = useDialogStoreNewTask()

function openNewTask() {
  dialogStoreNewTask.startCreatingNewTask()
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending':
      return 'red'
    case 'In progress':
      return 'blue'
    case 'Test':
      return 'purple'
    case 'Review':
      return 'orange'
    case 'Completed':
      return 'green'
    case 'Rejected':
      return 'grey'
    default:
      return 'default'
  }
}

function editTaskDialog(task: TaskDialog) {
  dialogStoreNewTask.editTaskDialog(task)
}
//#endregion

const cardsTasks = [
  // { id: 0, title: '', description: '', idEmployee: 0, estimatedDelivery: null, dateDelivery: null, status: '' },
  { id: 1, title: 'First', description: 'Teste', idEmployee: 1, estimatedDelivery: '2025-04-25', dateDelivery: '', status: 'Pending' },
  { id: 2, title: 'Secound', description: 'Teste', idEmployee: 2, estimatedDelivery: '2025-04-25', dateDelivery: '', status: 'Rejected' },
  { id: 3, title: 'Third', description: 'Teste', idEmployee: 2, estimatedDelivery: '2025-04-25', dateDelivery: '', status: 'In progress' },
  { id: 4, title: 'Fourth', description: 'Teste', idEmployee: 2, estimatedDelivery: '2025-04-25', dateDelivery: '', status: 'Test' },
  { id: 5, title: 'Fifth', description: 'Teste', idEmployee: 2, estimatedDelivery: '2025-04-25', dateDelivery: '', status: 'Review' },
]

</script>

<style scoped>
.wrap-text {
  white-space: normal;
  word-break: break-word;
}
</style>
