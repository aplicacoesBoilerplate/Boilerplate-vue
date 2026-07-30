<template>
  <v-text-field
    v-model="display"
    :label="label"
    :disabled="disabled"
    :variant="variant"
    prependInnerIcon="mdi-calendar-clock"
    readonly
    @click="dialog = true"
  />

  <v-menu
    v-model="dialog"
    :closeOnContentClick="false"
    width="auto"
    maxWidth="650"
  >
    <template #activator="{ props }">
      <div v-bind="props" />
    </template>

    <v-card max-height="650">
      <div
        class="d-flex justify-center px-4"
        style="overflow-y: auto; max-height: 90vh"
      >
        <v-date-picker
          v-if="step === 1"
          v-model="date"
          :min="minDate"
          title="Selecione a data"
          @update:modelValue="step = 2"
        />

        <v-time-picker
          v-if="step === 2"
          v-model="time"
          format="24hr"
          title="Selecione o horário"
        />
      </div>

      <v-card-actions>
        <v-btn
          color="warning"
          text
          @click="clear"
        >
          <v-icon class="pt-1">mdi-refresh</v-icon>Limpar
        </v-btn>

        <v-spacer />

        <v-btn
          :disabled="!date || step === 1"
          color="info"
          text
          @click="step = 1"
        >
          <v-icon class="pt-1">mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
          :disabled="!time || step === 2"
          color="info"
          text
          @click="step = 2"
        >
          <v-icon class="pt-1">mdi-chevron-right</v-icon>
        </v-btn>

        <v-spacer />

        <v-btn
          :disabled="!date || !time"
          color="success"
          variant="tonal"
          text
          @click="confirm"
        >
          <v-icon>mdi-check</v-icon>Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps<{
  label?: string;
  icon?: string;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled' | undefined;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const dialog = ref(false);
const step = ref(1);
const date = ref<Date | null>(null);
const time = ref<string | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      date.value = null;
      time.value = null;
      return;
    }

    const [datePart, timePart] = val.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');

    const jsDate = new Date(Number(year), Number(month) - 1, Number(day));
    date.value = jsDate;
    time.value = `${hour}:${minute}`;
  },
  { immediate: true },
);

const minDate = dayjs().format('YYYY-MM-DD');

// Exibe o valor formatado
const display = computed(() => {
  if (date.value && time.value) {
    return formatFinal();
  }
  return '';
});

// Função para montar a data final
function formatFinal(): string {
  if (!date.value || !time.value) return '';

  const jsDate = new Date(date.value);
  const day = String(jsDate.getDate()).padStart(2, '0');
  const month = String(jsDate.getMonth() + 1).padStart(2, '0');
  const year = jsDate.getFullYear();
  const [hour, minute] = time.value.split(':');

  return `${day}/${month}/${year} ${hour}:${minute}:00`;
}

function confirm() {
  dialog.value = false;
  step.value = 1;

  const result = formatFinal();
  emit('update:modelValue', result);
}

function clear() {
  step.value = 1;
  date.value = null;
  time.value = null;
  emit('update:modelValue', '');
}
</script>
