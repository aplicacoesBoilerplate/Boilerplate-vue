<template>
  <div class="custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <RouterLink to="/register" custom v-slot="{ navigate }">
      <v-btn icon @click="navigate" class="animated-btn">
        <v-icon color="white">mdi-account-plus-outline</v-icon>
      </v-btn>
      <span class="button-label" :class="{ visible: hover }">Solicitar acesso</span>
    </RouterLink>
  </div>
  <v-container class="d-flex justify-center align-center"
    style="margin: 0; padding: 0; height: 90vh; overflow: hidden;">
    <LoginForm />
  </v-container>

  <!-- Se for idendificado que a senha do usuário está expirada, o axios abrirá esse componente abaxio -->
  <DialogConfirmarSenha :model-value="confirmarSenha"
    @update:modelValue="(val: ConfirmarSenhaClass) => Object.assign(confirmarSenha, val)" />
</template>

<script lang="ts" setup>
// Componentes
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue';
import LoginForm from '@/components/LoginForm.vue';

// Vue
import { ref } from 'vue';

const hover = ref(false)
const confirmarSenha = ref(new ConfirmarSenhaClass())
</script>
