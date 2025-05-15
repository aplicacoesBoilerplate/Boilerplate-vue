<template>
  <div class="pa-4 text-center">
    <v-card prepend-icon="mdi-account" title="User Profile">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field clearable label="First name*" required></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field clearable label="Last name*" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-text-field clearable label="Email*" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-text-field clearable label="Password*" type="password" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-text-field clearable label="Confirm Password*" type="password" required></v-text-field>
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

<script setup lang="ts"></script>
