<template>
  <v-dialog v-model="dialogTask" max-width="650">

    <v-card :prepend-icon="isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
      :title="isEditing ? `Edit task: ${task.id}` : 'Create a new task'">
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

        <v-row v-if="isEditing">
          <v-col cols="12" class="d-flex justify-center">
            <v-autocomplete clearable v-model="task.status" label="Status task"
              :items="['Pending', 'In progress', 'Test', 'Review', 'Rejected']">
            </v-autocomplete>
          </v-col>
        </v-row>

        <small class="d-flex justify-center text-caption text-medium-emphasis">*indicates required
          field
        </small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="warning" variant="plain" @click="clearFields()"><v-icon>mdi-refresh</v-icon> Refresh</v-btn>
        <v-spacer></v-spacer>

        <v-btn color="red" variant="plain"
          @click="dialogStoreTask.closeTaskDialog()"><v-icon>mdi-close</v-icon>Close</v-btn>
        <v-btn color="success" variant="tonal"
          @click="isEditing ? updateTask() : createNewTask()"><v-icon>mdi-content-save-check</v-icon>Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDialogStoreTask } from './dialogStoreTask'
import type { Task } from '@/models/TaskModel'

const dialogStoreTask = useDialogStoreTask()

const dialogTask = computed({
  get: () => dialogStoreTask.showDialogTask.value,
  set: (val: boolean) => dialogStoreTask.showDialogTask.value = val
})

const task = ref<Task>({
  ...dialogStoreTask.emptyTask
})

watch(() => dialogStoreTask.taskToEdit.value, (taskToEdit) => {
  if (taskToEdit) {
    task.value = { ...taskToEdit }
  } else {
    task.value = {
      ...dialogStoreTask.emptyTask
    }
  }
}, { immediate: true })

var isEditing = computed(() => dialogStoreTask.taskToEdit.value !== null)

async function createNewTask() {
  await dialogStoreTask.createNewTask(task.value);
  resetForm();
}

async function updateTask() {
  await dialogStoreTask.updateTask(task.value);
  resetForm();
}

function clearFields() {
  task.value = { ...dialogStoreTask.emptyTask };
}

function resetForm() {
  clearFields();
  dialogStoreTask.closeTaskDialog()
}

</script>
