<template>
  <div>
    <h1>AboutCard</h1>
  </div>

  <v-expansion-panels v-for="version in versions" :key="version.release" style="padding-bottom: 0.5rem;">
    <v-expansion-panel :title="version.title" :text="version.about + ' In: ' + version.date">
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const versions = ref([
  // { release: '', title: '', about: '', date: 'yyyy-mm-dd hh:mm' },
  { release: '1.0', title: 'Composition API', about: 'Creating first components.', date: '2025-04-22 16:04' },
  { release: '1.2', title: 'Create Task', about: 'Created dialog for create a new task', date: '2025-04-23 10:30' },
])

</script>
