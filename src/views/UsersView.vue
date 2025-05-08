<template>
  <v-card class="mx-auto" max-width="700">
    <v-card-title>
      Company Employee List
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll :items="apiUsers" height="320" item-height="48">
      <template v-slot:default="{ item: user }">
        <v-list-item :subtitle="`#${user.permissao} email: ${user.email}`"
          :title="`${user.id} - ${user.username.toUpperCase()}`">
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <template v-slot:append>
            <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary" />
            <span class="pr-2" />
            <v-btn :icon="user.bloqueado ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'" size="x-small"
              variant="tonal" :color="user.bloqueado ? 'red' : 'success'" />
            <span class="pr-2" />
            <v-btn :icon="user.ativo ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline'" size="x-small"
              variant="tonal" :color="user.ativo ? 'success' : 'red'" />
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script setup lang="ts">
import type { Users } from '@/models/UsersModel';
import { usersServices } from '@/services/usersService';
import { onMounted, ref } from 'vue';
const userService = usersServices()
const apiUsers = ref<Users[]>()

async function getAllUsers() {
  apiUsers.value = await userService.getAllUsers()
}

onMounted(async () => {
  try {
    await getAllUsers()
  } catch (error) {
    throw error
  }
})
</script>
