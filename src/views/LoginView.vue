<template>
  <div class="custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <RouterLink to="/register" custom v-slot="{ navigate }">
      <v-btn icon @click="navigate" class="animated-btn">
        <v-icon color="white">mdi-account-plus-outline</v-icon>
      </v-btn>
      <span class="button-label" :class="{ visible: hover }">Register</span>
    </RouterLink>
  </div>
  <v-container class="d-flex justify-center align-center"
    style="margin: 0; padding: 0; height: 90vh; overflow: hidden;">
    <LoginForm />
  </v-container>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue';
import { ref } from 'vue';
const hover = ref(false)
</script>
