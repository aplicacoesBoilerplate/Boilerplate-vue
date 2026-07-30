<template>
  <v-card
    class="d-flex flex-column h-100"
    elevation="4"
    style="min-height: 0"
  >
    <v-card-title class="d-flex align-center pa-1">
      <InputDebouncer
        v-model:pesquisaCampo="pesquisaRegistros"
        :label="rotuloPesquisa"
        variant="outlined"
        density="compact"
        icon="mdi-database-search"
        @onSearch="pesquisarRegistros"
      />

      <v-tooltip
        :text="t('forms.consultaRegistrosFiltro.tooltipFechar')"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon="mdi-close"
            variant="text"
            density="comfortable"
            size="small"
            @click="emits('fechar')"
          />
        </template>
      </v-tooltip>
    </v-card-title>

    <v-card-text
      class="d-flex flex-column flex-grow-1 pt-0"
      style="min-height: 0"
    >
      <GenericInfiniteList
        :key="contextoConsulta"
        :cacheTtlMs="CACHE_TTL_CONSULTA_MS"
        :contexto="contextoConsulta"
        :textoVazio="textoVazio"
        :limite="limiteConsulta"
        :opcoesLimite="[limiteConsulta]"
        :serviceFetch="buscarRegistros"
        :exibirSeletorLimite="false"
        :textoFinal="t('forms.consultaRegistrosFiltro.textoFinal')"
        :textoError="t('forms.consultaRegistrosFiltro.textoErro')"
        storage="session"
        class="flex-grow-1"
      >
        <template #default="{ items }">
          <ItemConsultaRegistroFiltro
            v-for="registro in items as TRegistroConsulta[]"
            :key="String(resolverValorRegistro(registro))"
            :atributoDescricao="configuracaoConsulta.atributoDescricao"
            :atributoValor="configuracaoConsulta.atributoValor"
            :registro="registro"
            :selecionado="registroSelecionado(registro)"
            @selecionar="selecionarRegistro"
          />
        </template>

        <template #error>
          <div class="d-flex flex-column align-center justify-center pa-6 text-center text-error">
            <v-icon
              icon="mdi-alert-circle-outline"
              size="28"
              class="mb-1"
            />
            <span>{{ t('forms.consultaRegistrosFiltro.textoErro') }}</span>
          </div>
        </template>
      </GenericInfiniteList>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Enumns
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type {
  IConsultaRegistrosFiltro,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';

// Componentes
import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';
import GenericInfiniteList from '@/components/layouts/generic/GenericInfiniteList/GenericInfiniteList.vue';

import ItemConsultaRegistroFiltro from './ItemConsultaRegistroFiltro.vue';

type TRegistroConsulta = Record<string, unknown>;

// Constantes
const CACHE_TTL_CONSULTA_MS = 60 * 1000;

/**
 * @property {ICampoFiltro<T>} campoSelecionado - Campo selecionado no formulário de filtros.
 * @property {string} condicao - Condição selecionada no formulário de filtros.
 */
type TProps = {
  campoSelecionado: ICampoFiltro<unknown> | null;
  condicao?: string;
};
const props = defineProps<TProps>();

type TEmits = {
  fechar: [];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();

// Reativas - Model
const valorFiltro = defineModel<unknown>('valorFiltro', { required: true });
const valoresSelecionados = defineModel<unknown[]>('valoresSelecionados', { default: () => [] });

// Reativas - ref
const termoPesquisa = ref('');
const pesquisaRegistros = ref<string | null>('');

// Funções

/**
 * @description Normaliza o resultado da consulta auxiliar.
 * @param pResultado Resultado da consulta auxiliar.
 * @returns Resultado normalizado da consulta auxiliar.
 */
function normalizarResultadoConsulta(
  pResultado: IResultadoConsultaRegistrosFiltro<TRegistroConsulta> | TRegistroConsulta[],
): IResultadoConsultaRegistrosFiltro<TRegistroConsulta> {
  if (Array.isArray(pResultado)) {
    return {
      registros: pResultado,
      possuiMais: false,
    };
  }

  return pResultado;
}

/**
 * @description Resolve o valor do registro.
 * @param pRegistro Registro retornado pela consulta auxiliar.
 * @returns Valor do registro.
 */
function resolverValorRegistro(pRegistro: TRegistroConsulta): unknown {
  return pRegistro[configuracaoConsulta.value.atributoValor];
}

/**
 * @description Verifica se dois valores são iguais.
 * @param pPrimeiroValor Primeiro valor a ser comparado.
 * @param pSegundoValor Segundo valor a ser comparado.
 * @returns True se os valores forem iguais, false caso contrário.
 */
function valoresIguais(pPrimeiroValor: unknown, pSegundoValor: unknown): boolean {
  return String(pPrimeiroValor) === String(pSegundoValor);
}

/**
 * @description Verifica se um registro está selecionado.
 * @param pRegistro Registro a ser verificado.
 * @returns True se o registro estiver selecionado, false caso contrário.
 */
function registroSelecionado(pRegistro: TRegistroConsulta): boolean {
  const valorRegistro = resolverValorRegistro(pRegistro);

  if (Array.isArray(valorFiltro.value)) {
    return valorFiltro.value.some((pValor) => valoresIguais(pValor, valorRegistro));
  }

  return (
    valorFiltro.value !== undefined && valorFiltro.value !== null && valoresIguais(valorFiltro.value, valorRegistro)
  );
}

/**
 * @description Seleciona um registro na consulta auxiliar.
 * @param pRegistro Registro a ser selecionado.
 */
function selecionarRegistro(pRegistro: TRegistroConsulta): void {
  const valorRegistro = resolverValorRegistro(pRegistro);

  if (!permiteSelecaoMultipla.value) {
    valorFiltro.value = valorRegistro;
    valoresSelecionados.value = [valorRegistro];
    return;
  }

  const valoresAtuais = Array.isArray(valorFiltro.value) ? [...valorFiltro.value] : [];
  const registroJaSelecionado = valoresAtuais.some((pValor) => valoresIguais(pValor, valorRegistro));

  const novosValores = registroJaSelecionado
    ? valoresAtuais.filter((pValor) => !valoresIguais(pValor, valorRegistro))
    : [...valoresAtuais, valorRegistro];

  valorFiltro.value = novosValores;
  valoresSelecionados.value = novosValores;
}

/**
 * @description Manipula a pesquisa de registros.
 * @param pTermoPesquisa Termo de pesquisa.
 */
function pesquisarRegistros(pTermoPesquisa: string): void {
  termoPesquisa.value = pTermoPesquisa;
}

async function buscarRegistros(
  pPayload: IConsultaRegistros,
): Promise<IResultadoConsultaRegistros<TRegistroConsulta>> {
  const resultado = await configuracaoConsulta.value.buscarRegistros({
    campo: String(props.campoSelecionado?.valor ?? ''),
    condicao: props.condicao,
    limite: pPayload.limite,
    ordenacao: pPayload.ordenacao,
    proximaEntrada: pPayload.proximaEntrada,
    termoPesquisa: termoPesquisa.value,
  });

  return normalizarResultadoConsulta(resultado);
}

// Computadas
const configuracaoConsulta = computed<IConsultaRegistrosFiltro<TRegistroConsulta>>(() => {
  return props.campoSelecionado?.consultaRegistros as IConsultaRegistrosFiltro<TRegistroConsulta>;
});

const limiteConsulta = computed(() => configuracaoConsulta.value?.limiteInicial ?? 10);
const textoVazio = computed(
  () => configuracaoConsulta.value?.textoVazio ?? t('forms.consultaRegistrosFiltro.textoVazio'),
);
const rotuloPesquisa = computed(() => {
  const campo = props.campoSelecionado?.descricao ?? t('forms.consultaRegistrosFiltro.registros');

  return t('forms.consultaRegistrosFiltro.rotuloPesquisa', { campo });
});
const contextoConsulta = computed(() => {
  return [
    'consulta-registros-filtro',
    String(props.campoSelecionado?.valor ?? 'campo'),
    props.condicao ?? 'sem-condicao',
    termoPesquisa.value || 'sem-pesquisa',
  ].join(':');
});
const permiteSelecaoMultipla = computed(() =>
  [EOperadoresFiltro.SELECAO, EOperadoresFiltro.EXCECAO].includes(props.condicao as EOperadoresFiltro),
);
</script>
