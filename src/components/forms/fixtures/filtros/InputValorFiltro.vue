<template>
  <div class="input-valor-dinamico">
    <template v-if="tipoTemplate === 'NONE' || tipoTemplate === 'BOOLEAN'">
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

    <template v-else-if="tipoTemplate === 'MULTIPLE'">
      <v-autocomplete
        v-model="valorSelecaoMultipla"
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
      <v-row
        density="comfortable"
        align="center"
        class="mt-1"
      >
        <v-col cols="12" md="6">
          <v-number-input
            v-if="htmlType === 'number'"
            v-model="valorInicialIntervaloNumerico"
            :rules="[rules.required()]"
            :type="htmlType"
            label="De"
            controlVariant="stacked"
            variant="outlined"
            density="compact"
            autocomplete="off"
            hideDetails
            @keypress.enter="$emit('onEnter')"
          />

          <v-text-field
            v-else
            v-model="valorInicialIntervaloTexto"
            :rules="[rules.required()]"
            :type="htmlType"
            label="De"
            variant="outlined"
            density="compact"
            autocomplete="off"
            hideDetails
            @keypress.enter="$emit('onEnter')"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-number-input
            v-if="htmlType === 'number'"
            v-model="valorFinalIntervaloNumerico"
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
            v-model="valorFinalIntervaloTexto"
            :rules="[rules.required()]"
            :type="htmlType"
            label="Até"
            variant="outlined"
            density="compact"
            autocomplete="off"
            hideDetails
            @keypress.enter="$emit('onEnter')"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-number-input
        v-if="htmlType === 'number'"
        v-model="valorNumerico"
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
        v-model="valorTexto"
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
import type { IOpcaoSelecaoFiltro } from '@/models/filters/IOpcaoSelecaoFiltro';
import type { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

type TTemplateValorFiltro = 'NONE' | 'BOOLEAN' | 'MULTIPLE' | 'RANGE' | 'DEFAULT';
type TValorIntervalo = [unknown, unknown];

type TProps = {
  operador: EOperadoresFiltro | string | null;
  tiposCampo: ETipoFiltro[];
  opcoesDisponiveis?: IOpcaoSelecaoFiltro[];
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
const valor = defineModel<unknown>('valor', { required: true });

// Computadas
const computedRules = computed(() => {
  if (props.campo === 'RECURSO') return [];
  return [rules.required()];
});

const computedRulesMultiple = computed(() => {
  if (props.campo === 'RECURSO') return [];
  return [(pValor: unknown) => (Array.isArray(pValor) && pValor.length > 0) || 'Selecione ao menos um valor'];
});

// Descobre qual template renderizar baseado no operador e no tipo
const tipoTemplate = computed<TTemplateValorFiltro>(() => {
  if (!props.operador) return 'NONE';

  if ([EOperadoresFiltro.SELECAO, EOperadoresFiltro.EXCECAO].includes(props.operador as EOperadoresFiltro)) return 'MULTIPLE';
  if (props.operador === EOperadoresFiltro.ENTRE) return 'RANGE';
  if ([EOperadoresFiltro.VERDADEIRO, EOperadoresFiltro.FALSO].includes(props.operador as EOperadoresFiltro)) return 'BOOLEAN';

  return 'DEFAULT';
});

// Define o type="" nativo do HTML (texto, numero, data)
const htmlType = computed(() => {
  if (props.tiposCampo.includes('date' as ETipoFiltro)) return 'date';
  if (props.tiposCampo.includes('number' as ETipoFiltro) && !props.tiposCampo.includes('string' as ETipoFiltro)) return 'number';
  return 'text';
});

const valorSelecaoMultipla = computed<unknown[]>({
  get: () => (Array.isArray(valor.value) ? valor.value : []),
  set: (pNovosValores: unknown[]) => {
    valor.value = pNovosValores;
  },
});

const valorNumerico = computed<number | null>({
  get: () => normalizarNumero(valor.value),
  set: (pNovoValor: number | null) => {
    valor.value = normalizarNumero(pNovoValor);
  },
});

const valorTexto = computed<string>({
  get: () => normalizarTexto(valor.value),
  set: (pNovoValor: string) => {
    valor.value = pNovoValor;
  },
});

const valorInicialIntervaloNumerico = computed<number | null>({
  get: () => normalizarNumero(obterValorIntervalo(0)),
  set: (pNovoValor: number | null) => {
    atualizarValorIntervalo(0, pNovoValor);
  },
});

const valorFinalIntervaloNumerico = computed<number | null>({
  get: () => normalizarNumero(obterValorIntervalo(1)),
  set: (pNovoValor: number | null) => {
    atualizarValorIntervalo(1, pNovoValor);
  },
});

const valorInicialIntervaloTexto = computed<string>({
  get: () => normalizarTexto(obterValorIntervalo(0)),
  set: (pNovoValor: unknown) => {
    atualizarValorIntervalo(0, pNovoValor);
  },
});

const valorFinalIntervaloTexto = computed<string>({
  get: () => normalizarTexto(obterValorIntervalo(1)),
  set: (pNovoValor: unknown) => {
    atualizarValorIntervalo(1, pNovoValor);
  },
});

// Funções
function normalizarNumero(pValor: unknown): number | null {
  if (pValor === '' || pValor === null || pValor === undefined) {
    return null;
  }

  const numero = Number(pValor);

  return Number.isNaN(numero) ? null : numero;
}

function normalizarTexto(pValor: unknown): string {
  if (pValor === null || pValor === undefined) {
    return '';
  }

  return String(pValor);
}

function criarValorVazioIntervalo(): string | null {
  return htmlType.value === 'number' ? null : '';
}

function normalizarValorPorTipo(pValor: unknown): unknown {
  if (htmlType.value !== 'number') {
    return pValor;
  }

  return normalizarNumero(pValor);
}

function normalizarIntervaloAtual(): TValorIntervalo {
  const valorAtual = Array.isArray(valor.value) ? valor.value : [];

  return [
    valorAtual[0] ?? criarValorVazioIntervalo(),
    valorAtual[1] ?? criarValorVazioIntervalo(),
  ];
}

function obterValorIntervalo(pIndice: 0 | 1): unknown {
  const valorIntervalo = normalizarIntervaloAtual()[pIndice];

  if (htmlType.value === 'number') {
    return normalizarNumero(valorIntervalo);
  }

  return valorIntervalo;
}

function atualizarValorIntervalo(pIndice: 0 | 1, pNovoValor: unknown): void {
  const novoIntervalo = normalizarIntervaloAtual();
  novoIntervalo[pIndice] = normalizarValorPorTipo(pNovoValor);
  valor.value = novoIntervalo;
}

function atualizarValorBooleanoPorOperador(pOperador: EOperadoresFiltro | string | null): boolean {
  if (pOperador === EOperadoresFiltro.VERDADEIRO) {
    valor.value = true;
    return true;
  }

  if (pOperador === EOperadoresFiltro.FALSO) {
    valor.value = false;
    return true;
  }

  return false;
}

function montarValorInicialPorTemplate(pTemplate: TTemplateValorFiltro): unknown {
  if (pTemplate === 'RANGE') {
    return [criarValorVazioIntervalo(), criarValorVazioIntervalo()];
  }

  if (pTemplate === 'MULTIPLE') {
    return [];
  }

  return undefined;
}

// Observadores
// Sempre que mudar o template, reseta o valor para não dar crash de tipos
watch(() => [tipoTemplate.value, props.operador, htmlType.value], ([novoTemplate, novoOperador]) => {
  if (atualizarValorBooleanoPorOperador(novoOperador)) return;

  valor.value = montarValorInicialPorTemplate(novoTemplate as TTemplateValorFiltro);
});

</script>
