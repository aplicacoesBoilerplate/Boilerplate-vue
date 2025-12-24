<template>
  <v-container class="d-flex justify-center align-center"
    style="margin: 0; padding: 0; height: 90vh; overflow: hidden;">
    <LoginForm />
  </v-container>

</template>

<script lang="ts" setup>
// Componentes
import LoginForm from '@/components/forms/LoginForm.vue';

// Vue
import { ref } from 'vue';
</script>
