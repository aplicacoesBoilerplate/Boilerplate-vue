<template>
  <div>
    <h1>LoginPage</h1>
    <LoginForm />
  </div>
</template>

<script lang="ts">
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: { LoginForm }
}
</script>
