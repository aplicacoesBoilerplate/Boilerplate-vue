<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title>
      Company Employee List
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll :items="apiUsers" height="320" item-height="48">
      <template v-slot:default="{ item }">
        <v-list-item :subtitle="`#${item.permissao} email: ${item.email}`" :title="`${item.username.toUpperCase()}`">
          <template v-slot:prepend>
            <v-icon class="bg-primary">mdi-account</v-icon>
          </template>

          <template v-slot:append>
            <v-btn icon="mdi-pencil" size="x-small" variant="tonal"></v-btn>
          </template>
        </v-list-item>
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
