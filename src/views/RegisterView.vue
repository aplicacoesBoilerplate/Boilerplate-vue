<template>
  <div class="pb-2 custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <RouterLink to="/" custom v-slot="{ navigate }">
      <v-btn icon @click="navigate" class="animated-btn">
        <v-icon color="white">mdi-login</v-icon>
      </v-btn>
      <span class="button-label" :class="{ visible: hover }">Login</span>
    </RouterLink>
  </div>

  <v-container class="d-flex justify-center align-center"
    style="margin: 0; padding: 0; height: 90vh; overflow: hidden;">
    <RegisterForm />
  </v-container>
</template>

<script lang="ts" setup>
import RegisterForm from '@/components/RegisterForm.vue';
import { ref } from 'vue';
const hover = ref(false)
</script>
