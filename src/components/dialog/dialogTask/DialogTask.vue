<template>
  <v-dialog v-model="dialogTask" max-width="650">

    <v-form ref="formRef" v-model="formIsValid">
      <v-card :prepend-icon="dialogStoreTask.isEditing.value ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogStoreTask.isEditing.value ? `Edit task: ${task.id}` : 'Create a new task'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="task.title" label="Title task*" :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field clearable v-model="task.description" hint="Explain what the task consists of"
                persistent-hint label="Description*" :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-number-input clearable controlVariant="stacked" v-model="task.idEmployee" label="Responsible employee*"
                :rules="[rules.required]" @change="dialogStoreTask.getEmployeeName(task)"></v-number-input>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field clearable controlVariant="stacked" v-model="dialogStoreTask.employeeName.value" disabled
                label="Employee name" :rules="[rules.required]"></v-text-field>
            </v-col>

          </v-row>

          <v-row no-gutters>
            <v-col sm="12" md="6" class="d-flex justify-center pa-1">
              <v-date-input clearable v-model="task.estimatedDelivery" label="Date estimated delivery*" max-width="368"
                :rules="[rules.required]" prepend-icon="" prepend-inner-icon="$calendar" hint="format: MM/DD/YYYY"
                persistent-hint />
            </v-col>

            <v-col sm="12" md="6" class="d-flex justify-center pa-1">
              <v-date-input clearable v-model="task.dateDelivery" label="Date delivery" max-width="368" prepend-icon=""
                :disabled="!dialogStoreTask.isEditing.value" prepend-inner-icon="$calendar" hint="format: MM/DD/YYYY"
                persistent-hint />
            </v-col>
          </v-row>

          <v-row v-if="dialogStoreTask.isEditing.value">
            <v-col cols="12" class="d-flex justify-center">
              <v-autocomplete clearable v-model="task.status" label="Status task"
                :items="['Pending', 'In progress', 'Test', 'Review', 'Rejected']">
              </v-autocomplete>
            </v-col>
          </v-row>

          <small class="d-flex justify-center text-caption text-medium-emphasis pt-5">*indicates required
            field
          </small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="warning" variant="plain" @click="clearFields()"><v-icon>mdi-refresh</v-icon> Refresh</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="red" variant="plain"
            @click="dialogStoreTask.closeTaskDialog()"><v-icon>mdi-close</v-icon>Close</v-btn>
          <v-btn color="success" variant="tonal" :disabled="!formIsValid"
            @click="submitForm"><v-icon>mdi-content-save-check</v-icon>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDialogStoreTask } from './dialogStoreTask'
import type { Task } from '@/models/TaskModel'

const formRef = ref()
const formIsValid = ref(false)
const rules = {
  required: (v: string | number) => !!v || 'Required field',
}

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

watch(dialogTask, (val) => {
  if (!val) {
    resetForm()
  }
});

async function createNewTask() {
  const valid = await formRef.value.validate()
  if (!valid) return

  await dialogStoreTask.createNewTask(task.value);
  resetForm();
}

async function updateTask() {
  const valid = await formRef.value.validate()
  if (!valid) return

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

async function submitForm() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  dialogStoreTask.isEditing.value ? updateTask() : createNewTask()
}

</script>
