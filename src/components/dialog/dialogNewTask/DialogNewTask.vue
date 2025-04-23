<template>
  <v-dialog v-model="dialogNewTask" max-width="650">
    <v-card prepend-icon="mdi-plus-circle-outline" title="Create a new task">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field clearable v-model="task.title" label="Title task*" required></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field clearable v-model="task.description" hint="Explain what the task consists of" persistent-hint
              label="Description*" required></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-number-input clearable controlVariant="stacked" v-model="task.idEmployee" label="Responsible employee*"
              required></v-number-input>
          </v-col>

          <v-col cols="12" sm="6">
            <v-date-input clearable v-model="task.estimatedDelivery" label="Select a date"></v-date-input>
          </v-col>
        </v-row>

        <small class="d-flex justify-center text-caption text-medium-emphasis">*indicates required
          field</small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red" text="Close" variant="plain" @click="dialogStoreNewTask.closeNewTaskDialog()"></v-btn>

        <v-btn color="success" text="Save" variant="tonal" @click="CreateNewTask()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDialogStoreNewTask } from './dialogStoreNewTask'

const dialogStoreNewTask = useDialogStoreNewTask()

const dialogNewTask = computed({
  get: () => dialogStoreNewTask.showDialogNewTask.value,
  set: (val: boolean) => dialogStoreNewTask.showDialogNewTask.value = val
})

function createEmptyTask() {
  return {
    title: '',
    description: '',
    idEmployee: 0,
    estimatedDelivery: null
  }
}

let task = ref(createEmptyTask())

function CreateNewTask() {
  const bodyNewTask = task.value
  task.value = createEmptyTask()
  dialogStoreNewTask.closeNewTaskDialog()
}
</script>
