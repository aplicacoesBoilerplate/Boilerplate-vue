<template>
  <div class="input-valor-dinamico">
    <template v-if="tipoTemplate === 'NONE'">
      <div
        class="d-flex align-center"
        style="min-height: 40px;"
      >
        <div class="text-body-2 text-grey d-flex align-center px-2">
          <v-icon
            icon="mdi-information-outline"
            class="mr-2"
          />
          Nenhum valor necessário para esta condição.
        </div>
      </div>
    </template>

    <template v-else-if="tipoTemplate === 'BOOLEAN'">
      <v-switch
        v-model="valorTratado"
        :rules="[rules.required()]"
        class="mt-1"
        color="primary"
        label="Sim / Verdadeiro"
        hideDetails
        inset
      />
    </template>

    <template v-else-if="tipoTemplate === 'MULTIPLE'">
      <v-autocomplete
        v-model="valorTratado"
        :rules="computedRulesMultiple"
        :items="opcoesDisponiveis"
        itemTitle="title"
        itemValue="value"
        label="Selecione os valores"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        multiple
        clearable
        @keypress.enter="$emit('onEnter')"
      />
    </template>

    <template v-else-if="tipoTemplate === 'RANGE'">
      <div class="d-flex ga-2 align-center mt-2">
        <v-number-input
          v-if="htmlType === 'number'"
          v-model="rangeSafe[0]"
          :rules="[rules.required()]"
          :type="htmlType"
          label="De"
          controlVariant="stacked"
          variant="outlined"
          density="compact"
          autocomplete="off"
          hideDetails
        />

        <v-text-field
          v-else
          v-model="rangeSafe[0]"
          :rules="[rules.required()]"
          :type="htmlType"
          label="De"
          variant="outlined"
          density="compact"
          autocomplete="off"
          hideDetails
        />

        <v-number-input
          v-if="htmlType === 'number'"
          v-model="rangeSafe[1]"
          :rules="[rules.required()]"
          :type="htmlType"
          label="Até"
          controlVariant="stacked"
          variant="outlined"
          density="compact"
          autocomplete="off"
          hideDetails
          @keypress.enter="$emit('onEnter')"
        />

        <v-text-field
          v-else
          v-model="rangeSafe[1]"
          :rules="[rules.required()]"
          :type="htmlType"
          label="Até"
          variant="outlined"
          density="compact"
          autocomplete="off"
          hideDetails
          @keypress.enter="$emit('onEnter')"
        />
      </div>
    </template>

    <template v-else>
      <v-number-input
        v-if="htmlType === 'number'"
        v-model="valorTratado"
        :rules="computedRules"
        :type="htmlType"
        label="Valor"
        controlVariant="stacked"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        clearable
        @keypress.enter="$emit('onEnter')"
      />

      <v-text-field
        v-else
        v-model="valorTratado"
        :rules="computedRules"
        :type="htmlType"
        label="Valor"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        clearable
        @keypress.enter="$emit('onEnter')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, watch } from 'vue';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import type { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

type TProps = {
  operador: EOperadoresFiltro | string | null;
  tiposCampo: ETipoFiltro[];
  opcoesDisponiveis?: any[];
  campo?: string | null;
};
const props = defineProps<TProps>();

type TEmits = {
  onEnter: [];
};
defineEmits<TEmits>();

// Composables
const rules = useRules();

// Reativas
const valor = defineModel<any>('valor', { required: true });

// Computadas
const computedRules = computed(() => {
  if (props.campo === 'RECURSO') return [];
  return [rules.required()];
});

const computedRulesMultiple = computed(() => {
  if (props.campo === 'RECURSO') return [];
  return [(v: any) => (Array.isArray(v) && v.length > 0) || 'Selecione ao menos um valor'];
});

// Descobre qual template renderizar baseado no operador e no tipo
const tipoTemplate = computed(() => {
  if (!props.operador) return 'NONE';

  if ([EOperadoresFiltro.SELECAO, EOperadoresFiltro.EXCECAO].includes(props.operador as EOperadoresFiltro)) return 'MULTIPLE';
  if (props.operador === EOperadoresFiltro.ENTRE) return 'RANGE';
  if (props.tiposCampo.includes('boolean' as ETipoFiltro)) return 'BOOLEAN';

  return 'DEFAULT';
});

// Define o type="" nativo do HTML (texto, numero, data)
const htmlType = computed(() => {
  if (props.tiposCampo.includes('date' as ETipoFiltro)) return 'date';
  if (props.tiposCampo.includes('number' as ETipoFiltro) && !props.tiposCampo.includes('string' as ETipoFiltro)) return 'number';
  return 'text';
});

// Garante que os tipos vão corretos pra Store!
const valorTratado = computed({
  get: () => valor.value,
  set: (novoValor: any) => {
    // Tratamento estrito para números (para matar a duplicidade de '1000' vs 1000)
    if (htmlType.value === 'number') {
      if (tipoTemplate.value === 'RANGE' && Array.isArray(novoValor)) {
        valor.value = [
          novoValor[0] !== '' && !isNaN(Number(novoValor[0])) ? Number(novoValor[0]) : '',
          novoValor[1] !== '' && !isNaN(Number(novoValor[1])) ? Number(novoValor[1]) : ''
        ];
        return;
      }

      if (novoValor !== '' && novoValor !== null && !isNaN(Number(novoValor))) {
        valor.value = Number(novoValor);
        return;
      }
    }

    valor.value = novoValor;
  }
});

const rangeSafe = computed({
  get: () => Array.isArray(valor.value) ? valor.value : ['', ''],
  set: (novoRange) => { valor.value = novoRange; }
});

// Observadores
// Sempre que mudar o template, reseta o valor para não dar crash de tipos
watch(tipoTemplate, (novoTemplate) => {
  if (novoTemplate === 'RANGE' || novoTemplate === 'MULTIPLE') valor.value = [];
  else if (novoTemplate === 'BOOLEAN') valor.value = true;
  else valor.value = undefined;
});

</script>
