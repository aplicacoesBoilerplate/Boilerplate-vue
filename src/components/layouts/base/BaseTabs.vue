<template>
  <div class="d-flex w-100 align-center">
    <v-toolbar
      :class="`bg-${backgroundColor} rounded-te-xl`"
      density="compact"
      style="width: fit-content; flex: 0 0 auto"
    >
      <v-tabs
        v-model="tab"
        class="flex-grow-0 flex-shrink-0"
        hideSlider
      >
        <slot name="tabs"></slot>
      </v-tabs>
    </v-toolbar>

    <v-spacer />

    <div class="mr-3 align-self-center">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
type TProps = {
  backgroundColor?: string;
};

// Props com fallback
withDefaults(defineProps<TProps>(), {
  backgroundColor: 'surface',
});

// Reativas - Model
const tab = defineModel<string>('tab', { required: true });
</script>
