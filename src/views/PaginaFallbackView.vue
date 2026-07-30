<template>
  <v-container class="fill-height d-flex align-center justify-center text-center">
    <v-sheet
      elevation="0"
      maxWidth="600"
      class="bg-transparent"
    >
      <v-icon
        :icon="errorContent.icon"
        :color="errorContent.color"
        size="120"
        class="mb-6 animate-bounce"
      ></v-icon>

      <h1 class="text-h2 font-weight-bold mb-2 text-high-emphasis">
        {{ errorContent.code }}
      </h1>
      <h2 class="text-h4 font-weight-medium mb-4 text-medium-emphasis">
        {{ errorContent.title }}
      </h2>

      <p class="text-body-1 text-medium-emphasis mb-8">
        {{ errorContent.message }}
      </p>

      <div class="d-flex justify-center gap-4">
        <v-btn
          variant="outlined"
          color="primary"
          size="large"
          prependIcon="mdi-arrow-left"
          class="mr-4"
          @click="goBack"
        >
          Voltar
        </v-btn>

        <v-btn
          variant="flat"
          color="primary"
          size="large"
          prependIcon="mdi-home"
          @click="goHome"
        >
          Ir para o Início
        </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  type?: '403' | '404' | '500';
}>();

const router = useRouter();
const route = useRoute();

const errorType = computed(() => props.type || (route.name === 'AcessoNegado' ? '403' : '404'));

const errorContent = computed(() => {
  switch (errorType.value) {
    case '403':
      return {
        code: '403',
        title: 'Acesso Negado',
        message:
          'Você não tem permissão para acessar esta área. Se acredita que isso é um erro, contate o administrador.',
        icon: 'mdi-shield-lock-outline',
        color: 'error',
      };
    case '500':
      return {
        code: '500',
        title: 'Erro Interno',
        message: 'Algo deu errado nos nossos servidores. Tente novamente mais tarde.',
        icon: 'mdi-server-network-off',
        color: 'warning',
      };
    case '404':
    default:
      return {
        code: '404',
        title: 'Página não encontrada',
        message: 'Não encontramos a página que você está procurando.',
        icon: 'mdi-map-marker-question-outline',
        color: 'info',
      };
  }
});

function goHome() {
  router.push('/');
}

function goBack() {
  router.go(-1);
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>
