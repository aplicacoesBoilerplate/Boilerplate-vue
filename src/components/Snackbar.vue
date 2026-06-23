<template>
  <v-snackbar
    v-model="snackbarStore.visible"
    :color="snackbarStore.color"
    :timeout="snackbarTimeout"
    class="py-15"
    location="top right"
    variant="elevated"
    rounded="ts-xl be-xl"
    multiLine
  >
    {{ translatedMessage }}

    <template
      v-slot:actions
      :close="store.hideSnackbar()"
    >
      <v-btn
        color="white"
        variant="text"
        icon="mdi-close"
        size="small"
        @click="snackbarStore.hideSnackbar()"
      />
    </template>

    <v-progress-linear
      :model-value="progress"
      height="4"
      color="white"
      absolute
      bottom
    />
  </v-snackbar>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref, watch, onBeforeUnmount, computed } from "vue";
import { useI18n } from "vue-i18n";

// Stores
import { useSnackbarStore } from "@/stores/SnackbarStore";

// Constantes
const snackbarTimeout = 4000;
const intervalStep = 50;

// Store
const snackbarStore = useSnackbarStore();

// Composables
const { t, te } = useI18n();

// Reativas
const progress = ref(100);

// Variáveis
let intervalId: number | null = null;

// Computadas
const translatedMessage = computed(() => {
  const msg = snackbarStore.message;
  if (!msg) return "";

  return te(msg) ? t(msg) : msg;
});

// Funções
function clearProgress() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startProgress() {
  clearProgress();

  let elapsed = 0;
  progress.value = 100;

  intervalId = setInterval(() => {
    elapsed += intervalStep;
    progress.value = 100 - (elapsed / snackbarTimeout) * 100;

    if (elapsed >= snackbarTimeout) {
      clearProgress();
    }
  }, intervalStep);
}

// Observadores
watch(() => snackbarStore.visible, (isVisible) => {
    if (isVisible) {
      startProgress();
    } else {
      clearProgress();
      progress.value = 100;
    }
  },
);

// Lifecycle Hooks
onBeforeUnmount(() => {
  clearProgress();
});

</script>
