<template>
  <h2 class="d-flex justify-center">Filters</h2>
  <div class="d-flex justify-center">
    <v-col cols="6">
      <v-row>
        <v-col cols="4">
          <v-autocomplete clearable :items=statusOptions label="Status" auto-select-first />
        </v-col>

        <v-col cols="4">
          <v-number-input clearable :reverse="false" controlVariant="stacked" label="Employee" :hideInput="false" inset
            variant="solo-filled" />
        </v-col>

        <v-col cols="4">
          <v-date-input clearable label="Select range" max-width="368" multiple="range" hint="format: MM/DD/YYYY"
            persistent-hint />
        </v-col>

        <v-col cols="12" class="d-flex justify-center">
          <v-btn type="submit" block>
            Search
            <v-icon color="success">mdi-check-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script setup lang="ts">

const statusOptions = ['Pending', 'In progress', 'Test', 'Review', 'Completed', 'Rejected']

</script>
