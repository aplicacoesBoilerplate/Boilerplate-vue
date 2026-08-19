<template>
  <v-list-subheader
    v-if="exibirTitulo || exibirIcone"
    class="d-flex align-center ga-2 text-uppercase text-caption font-weight-bold mt-2"
  >
    <v-icon
      v-if="exibirIcone"
      :icon="icone"
      size="small"
    />
    <span v-if="titulo">{{ titulo }}</span>
    <slot />
  </v-list-subheader>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TProps = {
  titulo?: string;
  icone?: string;
};

const props = withDefaults(defineProps<TProps>(), {
  titulo: '',
  icone: '',
});

const exibirTitulo = computed(() => !!props.titulo);
const exibirIcone = computed(() => !!props.icone);
</script>
