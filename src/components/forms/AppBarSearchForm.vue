<template>
  <v-form @submit.prevent="onSubmit" class="search-form w-100">
    <v-text-field
      ref="inputRef"
      v-model="classFormQuery.stagingModel.value"
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
      :rules="[rules.required()]"
    >
      <template #prepend-inner v-if="$vuetify.display.mdAndUp">
        <div class="d-flex flex-row" v-if="hasFilters">
          <BtnOpenDialog
            icon="mdi-filter-cog"
            v-tooltip="t('tooltips.appBar.filter')"
            :rotate="false"
            @click="toggleDialogQueryFilter"
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

  <BaseDialog v-model:attributes="classDialogQueryFilter.model">
    <template v-slot:title>
      {{ t('messages.components.queryFilter.title') }} {{ titleDialogFilter }}
    </template>

    <template #default>
      <v-tabs color="primary" v-model="tab">
        <v-tab value="form">{{ t('tabs.dialogQueryFilter.form') }}</v-tab>
        <v-tab value="list">{{ t('tabs.dialogQueryFilter.list') }}</v-tab>
      </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="form">
            <div class="mt-3">
              <QueryFilterForm
              ref="refFormQuery"
              v-model:filter="classFormQuery.stagingModel"
              v-model:valid="isFormValid"
              :filter-manager="classFormQuery"
              />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="list">
            <v-virtual-scroll
              v-if="classFormQuery.model.length > 0"
              :items="classFormQuery.model"
              height="300"
            >
              <template v-slot:default="{ index, item }">
                <v-list
                  lines="two"
                  rounded
                  variant="elevated"
                >
                  <v-list-item
                    :title="formatTitle(item)"
                    :subtitle="formatSubtitle(item)"
                    class="mb-2"
                  >
                    <template #prepend>
                      <v-avatar
                        color="primary"
                        variant="tonal"
                        size="small"
                      >
                        {{ index + 1 }}
                      </v-avatar>
                    </template>
                    <template #append>
                      <v-btn
                        icon="mdi-delete"
                        color="error"
                        variant="text"
                        size="small"
                        @click="classFormQuery.removeFilter(index)"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </template>
            </v-virtual-scroll>

            <div v-else class="text-center text-medium-emphasis mt-10">
              <v-icon size="40" icon="mdi-filter-off-outline" class="mb-2"/>
              <div>{{ t('filterColumn.none') }}</div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
    </template>

    <template #actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="handleReset"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-filter-plus"
        v-tooltip="t('tooltips.forms.add')"
        variant="text"
        color="info"
        :disabled="!isFormValid"
        @click="handleAddFilter"
      />

      <v-spacer />

      <v-icon-btn
        v-if="tab === 'list'"
        icon="mdi-magnify"
        v-tooltip="t('tooltips.appBar.search')"
        variant="text"
        color="success"
        @click="onSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '../dialog/BaseDialog.vue'
import BtnOpenDialog from '../dialog/BtnOpenDialog.vue'
import QueryFilterForm from './QueryFilterForm.vue'
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { ClassQueryFilter } from '@/classes/ClassQueryFilter'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { useHotkey } from 'vuetify'
import { useRules } from 'vuetify/labs/rules'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, nextTick, ref } from 'vue'

const route = useRoute();
const rules = useRules();
const { t } = useI18n();
const snackbar = useSnackbarStore();

const titleDialogFilter = computed(() => {
  const titleKey = route.meta?.title as string | undefined

  if (titleKey) {
    return t(titleKey)
  }

  return ''
})

const hasFilters = computed(() => { return !!route.meta?.hasFilters; });
const tab = ref('form')
const props = defineProps<{ loading: boolean }>()
const emits = defineEmits(['search'])

const classDialogQueryFilter = new ClassBaseDialog({
  view: false,
  maxHeight: 500,
  maxWidth: 600,
})

function toggleDialogQueryFilter() {
  classFormQuery.updateStaging({
    field: classFormQuery.filters[1]?.key,
    condition: 'contains'
  });
  classDialogQueryFilter.toggleDialog()
}

const classFormQuery = new ClassQueryFilter()
const refFormQuery = ref<InstanceType<typeof QueryFilterForm> | null>(null);
const isFormValid = ref(false);
const inputRef = ref<any>(null)

useHotkey('ctrl+k', () => {
  inputRef.value?.focus()
})

function formatTitle(item: IQueryFilter) {
  const col = classFormQuery.getColumnType(item.field);
  const label = col ? t(col.label) : item.field;

  let conditionLabel = '';
  if (item.condition) {
    conditionLabel = t(`filterColumn.operators.${item.condition}`);
  }

  return `${label} (${conditionLabel})`;
}

function formatSubtitle(item: IQueryFilter) {
  if (item.condition === 'between') return `${item.startDate} - ${item.endDate}`;
  return item.value;
}

async function handleAddFilter() {
  const validFilter = classFormQuery.addFilter();
  if (validFilter) {
    await nextTick();
    refFormQuery.value?.reset();
  }
  else {
    const errorMessage = t('messages.components.queryFilter.alertDuplicate');
    snackbar.showSnackbar(errorMessage, 'warning');
  }
}

async function handleReset() {
  if (tab.value === 'form') {
    classFormQuery.resetStaging();
    await nextTick();
    refFormQuery.value?.reset();
  } else {
    classFormQuery.reset();
  }
}

function onSubmit() {
  const filtrosParaEnviar = [...classFormQuery.model];
  const staging = classFormQuery.stagingModel;

  if (filtrosParaEnviar.length === 0 && staging.value) {
    filtrosParaEnviar.push(staging);
  }

  emits('search', filtrosParaEnviar);
}
</script>

<style scoped>
.search-form {
  max-width: 480px;
}
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
