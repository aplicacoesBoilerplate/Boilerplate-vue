<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-row dense align="center">
      <v-col cols="12" class="mb-3">
        <v-select
          v-model="filter.field"
          :rules="[rules.required()]"
          @update:model-value="handleFieldChange"
          :label="t('forms.formSearch.inputField.label')"
          :items="filterManager.filters"
          item-value="key"
          hide-details="auto"
          density="compact"
          variant="outlined"
        >
          <template #selection="{ item }">
            {{ item.raw?.label ? t(item.raw.label) : filter.field }}
          </template>

          <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="t(item.raw.label)" />
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" class="mb-3">
        <v-select
          v-model="filter.condition"
          :rules="[rules.required()]"
          :label="t('forms.formSearch.inputCondition.label')"
          :items="getOperators(filter.field)"
          item-title="title"
          item-value="value"
          hide-details="auto"
          density="compact"
          variant="outlined"
          :disabled="!filter.field"
        >
          <template #selection="{ item }">
            {{ t(item.title) }}
          </template>

          <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="t(item.raw.title)" />
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" class="mb-3">
        <div v-if="getType(filter.field) === 'date' && filter.condition === 'between'" class="d-flex gap-2">
          <v-text-field
            v-model="filter.startDate"
            :rules="[rules.required()]"
            type="date"
            :label="t('messages.from')"
            density="compact"
            hide-details
            variant="outlined"
          />
          <v-spacer />
          <v-text-field
            v-model="filter.endDate"
            :rules="[rules.required()]"
            type="date"
            :label="t('messages.until')"
            density="compact"
            hide-details
            variant="outlined"
          />
        </div>

        <v-text-field
          v-else-if="getType(filter.field) === 'date'"
          v-model="filter.startDate"
          :rules="[rules.required()]"
          type="date"
          density="compact"
          hide-details
          variant="outlined"
        />

        <v-select
          v-else-if="getType(filter.field) === 'boolean'"
          v-model="filter.value"
          :rules="[rules.required()]"
          :items="[{title: t('messages.yes'), value: 'true'}, {title: t('messages.no'), value: 'false'}]"
          density="compact"
          hide-details
          variant="outlined"
        />

        <v-select
          v-else-if="getType(filter.field) === 'select'"
          v-model="filter.value"
          :rules="[rules.required()]"
          :label="t('filterColumn.operators.select')"
          :items="getOptions(filter.field)"
          density="compact" hide-details
          variant="outlined"
        />

        <div v-else-if="getType(filter.field) === 'number' && filter.condition === 'between'" class="d-flex gap-2">
          <v-text-field
            v-model="filter.value"
            :rules="[rules.required()]"
            type="number"
            label="Min"
            density="compact"
            hide-details
            variant="outlined"
          />
          <v-text-field
            v-model="filter.endDate"
            :rules="[rules.required()]"
            type="number"
            label="Max"
            density="compact"
            hide-details
            variant="outlined"
          />
        </div>

        <v-text-field
          v-else
          v-model="filter.value"
          :rules="[rules.required()]"
          :type="getType(filter.field) === 'number' ? 'number' : 'text'"
          :label="t('messages.value')"
          :disabled="!filter.condition"
          hide-details="auto"
          density="compact"
          variant="outlined"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import type { ClassQueryFilter } from '@/classes/ClassQueryFilter';
import type { IQueryFilter } from '@/classes/models/modelComponents/ModelQueryFilter';
import { OPERATORS, type FilterType } from '@/classes/ClassDefinitions';
import { useRules } from 'vuetify/labs/rules'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const props = defineProps<{
  filterManager: ClassQueryFilter
}>();

const rules = useRules();
const { t } = useI18n();
const formRef = ref<any>(null);
const filter = defineModel<IQueryFilter>('filter', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

const getType = (fieldKey: string): FilterType | undefined => {
  return props.filterManager.getColumnType(fieldKey)?.type;
};

const getOptions = (fieldKey: string) => {
  return props.filterManager.getColumnType(fieldKey)?.options || [];
};

const getOperators = (fieldKey: string) => {
  const type = getType(fieldKey);
  return type ? OPERATORS[type] : [];
};

const handleFieldChange = (newField: string) => {
  props.filterManager.fieldChanged(newField);
};

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});
</script>
