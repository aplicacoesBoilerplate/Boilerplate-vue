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
                {{ task.title }}
              </v-col>
              <v-col class="text--secondary" cols="8">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded">
                    <v-row style="width: 100%" no-gutters>
                      <v-col class="d-flex justify-start" cols="4">
                        Description: {{ task.description || 'Not set' }}
                      </v-col>
                      <v-col class="d-flex justify-start" cols="4">
                        Employee: {{ task.idEmployee || 'Not set' }}
                      </v-col>
                      <v-col class="d-flex justify-start" cols="4">
                        Task {{ task.status }}
                      </v-col>
                    </v-row>
                  </span>
                  <v-row v-else style="width: 100%" no-gutters>
                    <v-col class="d-flex justify-start" cols="6">
                      Task {{ task.status }}
                    </v-col>
                    <v-col class="d-flex justify-start" cols="6">
                      Estimated delivery: {{ task.estimatedDelivery }}
                    </v-col>
                  </v-row>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row justify="space-around" no-gutters>
              <v-col cols="3">
                <v-date-input clearable v-model="task.estimatedDelivery" label="Date estimated delivery" max-width="368"
                  hint="format: MM/DD/YYYY" persistent-hint />
              </v-col>

              <v-col cols="3">
                <v-date-input clearable v-model="task.dateDelivery" label="Date delivery" max-width="368"
                  hint="format: MM/DD/YYYY" persistent-hint />
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

const dialogStoreNewTask = useDialogStoreNewTask()

function openNewTask() {
  dialogStoreNewTask.openNewTaskDialog()
}
//#endregion

const cardsTasks = [
  // { id: 0, title: '', description: '', idEmployee: 0, estimatedDelivery: null, dateDelivery: null, status: '' },
  { id: 1, title: 'First', description: 'Teste', idEmployee: 1, estimatedDelivery: '2025-04-25', dateDelivery: null, status: 'Pending' },
  { id: 2, title: 'Secound', description: 'Teste', idEmployee: 2, estimatedDelivery: '2025-04-25', dateDelivery: null, status: 'Pending' },
  { id: 3, title: 'Third', description: 'Teste', idEmployee: 2, estimatedDelivery: '2025-04-25', dateDelivery: null, status: 'Pending' },
]

</script>
