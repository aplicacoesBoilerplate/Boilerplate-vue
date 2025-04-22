<template>
  <div class="pa-4 text-center">
    <v-card prepend-icon="mdi-cog-outline" title="Configurations">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field label="connection database*" required></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-number-input :reverse="false" controlVariant="stacked" label="port*" :hideInput="false" inset
              variant="outlined">
            </v-number-input>
          </v-col>

          <v-col cols="12" md="6">
            <v-number-input :reverse="false" controlVariant="stacked" label="paginator limit" :hideInput="false" inset
              variant="outlined" :min="1" :max="100" hint="Min: 1 / Max: 100">
            </v-number-input>
          </v-col>

          <v-col cols="12" md="6">
            <v-list-item subtitle="Auto-update apps at any time. Data charges may apply" title="Sound"
              @click="sound = !sound">
              <template v-slot:prepend>
                <v-list-item-action start>
                  <v-checkbox-btn v-model="sound" color="primary"></v-checkbox-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*indicates required field</small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red" text="Close" variant="plain"></v-btn>

        <v-btn color="success" text="Save" variant="tonal"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const sound = shallowRef(true)
</script>
