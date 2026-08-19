<template>
  <div class="input-valor-dinamico">
    <template v-if="tipoTemplate === 'NONE' || tipoTemplate === 'BOOLEAN'">
      <div
        class="d-flex align-center"
        style="min-height: 40px"
      >
        <div class="text-body-2 text-grey d-flex align-center px-2">
          <v-icon
            icon="mdi-information-outline"
            class="mr-2"
          />
          {{ t('components.inputValorFiltro.valorNaoNecessario') }}
        </div>
      </div>
    </template>

    <InputValorFiltroMultiplo
      v-else-if="tipoTemplate === 'MULTIPLE'"
      v-model:valor="valor"
      :opcoesDisponiveis="opcoesVuetify"
      @onEnter="emitirEnter"
    />

    <InputValorFiltroRange
      v-else-if="tipoTemplate === 'RANGE'"
      v-model:valor="valor"
      :htmlType="htmlType"
      @onEnter="emitirEnter"
    />

    <InputValorFiltroDefault
      v-else
      v-model:valor="valor"
      :htmlType="htmlType"
      :campo="campo"
      @onEnter="emitirEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import type { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';

import InputValorFiltroDefault from './inputValorFiltro/InputValorFiltroDefault.vue';
import InputValorFiltroMultiplo from './inputValorFiltro/InputValorFiltroMultiplo.vue';
import InputValorFiltroRange from './inputValorFiltro/InputValorFiltroRange.vue';

type TTemplateValorFiltro = 'NONE' | 'BOOLEAN' | 'MULTIPLE' | 'RANGE' | 'DEFAULT';

type TOpcaoSelecaoVuetify = {
  title: string;
  value: unknown;
};

type TProps = {
  operador: EOperadoresFiltro | string | null;
  tiposCampo: ETipoFiltro[];
  opcoesDisponiveis?: TOpcaoSelecaoVuetify[];
  campo?: string | null;
};

const props = defineProps<TProps>();

type TEmits = {
  onEnter: [];
};

const emits = defineEmits<TEmits>();

const { t } = useI18n();

const valor = defineModel<unknown>('valor', { required: true });

const tipoTemplate = computed<TTemplateValorFiltro>(() => {
  if (!props.operador) return 'NONE';
  if ([EOperadoresFiltro.SELECAO, EOperadoresFiltro.EXCECAO].includes(props.operador as EOperadoresFiltro))
    return 'MULTIPLE';
  if (props.operador === EOperadoresFiltro.ENTRE) return 'RANGE';
  if ([EOperadoresFiltro.VERDADEIRO, EOperadoresFiltro.FALSO].includes(props.operador as EOperadoresFiltro))
    return 'BOOLEAN';
  return 'DEFAULT';
});

const htmlType = computed(() => {
  if (props.tiposCampo.includes('date' as ETipoFiltro)) return 'date';
  if (props.tiposCampo.includes('number' as ETipoFiltro) && !props.tiposCampo.includes('string' as ETipoFiltro))
    return 'number';
  return 'text';
});

const opcoesVuetify = computed<TOpcaoSelecaoVuetify[]>(() => {
  if (!props.opcoesDisponiveis) return [];
  return props.opcoesDisponiveis;
});

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
  if (pTemplate === 'RANGE') return ['', ''];
  if (pTemplate === 'MULTIPLE') return [];
  return undefined;
}

function emitirEnter(): void {
  emits('onEnter');
}

watch(
  () => [tipoTemplate.value, props.operador],
  ([pNovoTemplate, pNovoOperador]) => {
    if (atualizarValorBooleanoPorOperador(pNovoOperador)) return;
    valor.value = montarValorInicialPorTemplate(pNovoTemplate as TTemplateValorFiltro);
  },
);
</script>
