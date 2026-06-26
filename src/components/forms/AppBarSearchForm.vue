<template>
  <v-form @submit.prevent="onSubmit" class="search-form w-100">
    <v-text-field
      ref="inputRef"
      v-model="searchQuery"
      class="rounded-search"
      hide-details
      single-line
      clearable
      rounded="pill"
      density="compact"
      variant="solo"
      loader-height="2"
      :loading="loading"
      :placeholder="t('forms.formSearch.inputSearch.placeholder')"
    >
      <template #prepend-inner v-if="$vuetify.display.mdAndUp">
        <div class="d-flex flex-row" v-if="hasFilters">
          <v-btn
            icon="mdi-filter-cog"
            v-tooltip="t('tooltips.appBar.filter')"
            variant="text"
            size="small"
            @click="toggleDrawerFilter"
          />

          <v-divider
            vertical
            class="mx-1 me-2 my-auto"
            style="height: 24px"
            :thickness="2"
          />
        </div>

        <v-hotkey
          keys="ctrl+k"
          display-mode="icon"
          variant="contained"
          platform="auto"
          class="mr-2"
        />
      </template>

      <template #append-inner>
        <v-icon-btn
          icon="mdi-magnify"
          v-tooltip="t('tooltips.appBar.search')"
          variant="plain"
          @click="onSubmit"
        />
      </template>
    </v-text-field>
  </v-form>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHotkey } from 'vuetify'

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store'

type TProps = { loading: boolean };
defineProps<TProps>();

type TEmits = { search: [query: string] };
const emits = defineEmits<TEmits>();

// Composables
const route = useRoute();
const { t } = useI18n();

// Stores
const filterStore = useGenericFilterStore();

// Reativas - Model/ref
const inputRef = ref<any>(null)
const searchQuery = ref('');

// Funções
function toggleDrawerFilter() {
  filterStore.drawerFilterOpen = !filterStore.drawerFilterOpen;
}

function onSubmit() {
  if (searchQuery.value) {
    emits('search', searchQuery.value);
  }
}

// Computadas
const hasFilters = computed(() => { return !!route.meta?.filterResource; });

// Observadores e Hooks
useHotkey('ctrl+k', () => {
  inputRef.value?.focus()
})

</script>

<style scoped>
.search-form {
  max-width: 480px;
}
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
