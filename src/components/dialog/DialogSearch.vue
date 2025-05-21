<template>
  <v-dialog v-model="exibir" max-width="500">
    <v-form ref="formRef" @submit.prevent="submitForm()">
      <v-card title="What are you looking for?">
        <v-card-text>
          <v-text-field hint="Ex: task status, accountable" v-model="search" label="Search..."
            prepend-inner-icon="mdi-magnify" clearable />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text="Close" color="red" variant="outlined" @click="resetForm()" />
          <v-btn text="Confirm" color="teal-darken-1" variant="outlined" type="submit" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const exibir = defineModel<boolean>('exibir', { required: false, default: false })

watch(exibir, (val) => {
  if (!val) {
    resetForm()
  }
});

function resetForm() {
  exibir.value = false
  search = ref('');
}

let search = ref('')

function submitForm() {
  resetForm()
}

</script>
