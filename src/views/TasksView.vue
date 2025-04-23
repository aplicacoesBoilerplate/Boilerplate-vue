<template>
  <v-btn icon @click="openNewTask()">
    <v-icon color="white">mdi-plus-circle-outline</v-icon>
  </v-btn>
  <DialogNewTask />
</template>

<script setup lang=ts>
import { ref } from 'vue';
import DialogNewTask from '@/components/dialog/dialogNewTask/DialogNewTask.vue'
import { useDialogStoreNewTask } from '@/components/dialog/dialogNewTask/dialogStoreNewTask'

const dialogStoreNewTask = useDialogStoreNewTask()

function openNewTask() {
  dialogStoreNewTask.openNewTaskDialog()
}

</script>
