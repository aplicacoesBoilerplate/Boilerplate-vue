<template>
  <v-dialog v-model="dialogSearch" max-width="500">
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
import { ref, computed, watch } from 'vue'
import { useDialogStoreSearch } from './dialogStoreSearch'

const dialogStoreSearch = useDialogStoreSearch()

const dialogSearch = computed({
  get: () => dialogStoreSearch.showDialogSearch.value,
  set: (val: boolean) => dialogStoreSearch.showDialogSearch.value = val
})

watch(dialogSearch, (val) => {
  if (!val) {
    resetForm()
  }
});

function resetForm() {
  dialogStoreSearch.closeSearchDialog()
  search = ref('');
}

let search = ref('')

function submitForm() {
  dialogStoreSearch.search(search.value)
  resetForm()
}

</script>
