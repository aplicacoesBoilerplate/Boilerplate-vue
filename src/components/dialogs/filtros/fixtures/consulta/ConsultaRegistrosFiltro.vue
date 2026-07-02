<template>
  <v-card
    class="d-flex flex-column h-100"
    elevation="4"
    style="min-height: 0"
  >
    <v-card-title class="d-flex align-center pa-1">
      <InputDebouncer
        v-model:pesquisaCampo="pesquisaRegistros"
        :label="`Pesquisar ${campoSelecionado?.descricao ?? 'registros'}`"
        variant="outlined"
        density="compact"
        icon="mdi-database-search"
        @onSearch="handlePesquisarRegistros"
      />

      <v-tooltip
        text="Fechar consulta auxiliar"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            icon="mdi-close"
            variant="text"
            density="comfortable"
            size="small"
            @click="emit('fechar')"
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
        :contextId="contextoConsulta"
        :emptyText="textoVazio"
        :initialLimit="limiteConsulta"
        :limitOptions="[limiteConsulta]"
        :serviceFetch="handleBuscarRegistros"
        :showLimitSelector="false"
        endText="Todos os registros foram carregados."
        errorText="Não foi possível consultar os registros."
        storage="session"
        class="flex-grow-1"
      >
        <template #default="{ items }">
          <ItemConsultaRegistroFiltro
            v-for="registro in (items as TRegistroConsulta[])"
            :key="String(resolveValorRegistro(registro))"
            :atributoDescricao="configuracaoConsulta.atributoDescricao"
            :atributoValor="configuracaoConsulta.atributoValor"
            :registro="registro"
            :selecionado="isRegistroSelecionado(registro)"
            @selecionar="handleSelecionarRegistro"
          />
        </template>

        <template #error>
          <div class="d-flex flex-column align-center justify-center pa-6 text-center text-error">
            <v-icon
              icon="mdi-alert-circle-outline"
              size="28"
              class="mb-1"
            />
            <span>Não foi possível consultar os registros.</span>
          </div>
        </template>
      </GenericInfiniteList>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';

// Types e Interfaces
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type {
  IConsultaRegistrosFiltro,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';

// Enumns
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Componentes
import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';
import GenericInfiniteList from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteList.vue';
import ItemConsultaRegistroFiltro from './ItemConsultaRegistroFiltro.vue';

type TRegistroConsulta = Record<string, unknown>;

// Constantes
const CACHE_TTL_CONSULTA_MS = 60 * 1000;

type TProps = {
  /**
   * Campo selecionado no formulário de filtros.
   */
  campoSelecionado: ICampoFiltro<unknown> | null;
  /**
   * Condição selecionada no formulário de filtros.
   */
  condicao?: string;
};
const props = defineProps<TProps>();

type TEmits = {
  fechar: [];
};
const emit = defineEmits<TEmits>();

// Reativas - Model
const valorFiltro = defineModel<unknown>('valorFiltro', { required: true });
const valoresSelecionados = defineModel<unknown[]>('valoresSelecionados', { default: () => [] });

// Reativas - ref
const termoPesquisa = ref('');
const pesquisaRegistros = ref<string | null>('');

// Funções
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

function resolveValorRegistro(pRegistro: TRegistroConsulta): unknown {
  return pRegistro[configuracaoConsulta.value.atributoValor];
}

function isMesmoValor(pPrimeiroValor: unknown, pSegundoValor: unknown): boolean {
  return String(pPrimeiroValor) === String(pSegundoValor);
}

function isRegistroSelecionado(pRegistro: TRegistroConsulta): boolean {
  const valorRegistro = resolveValorRegistro(pRegistro);

  if (Array.isArray(valorFiltro.value)) {
    return valorFiltro.value.some((pValor) => isMesmoValor(pValor, valorRegistro));
  }

  return valorFiltro.value !== undefined && valorFiltro.value !== null && isMesmoValor(valorFiltro.value, valorRegistro);
}

function handleSelecionarRegistro(pRegistro: TRegistroConsulta): void {
  const valorRegistro = resolveValorRegistro(pRegistro);

  if (!permiteSelecaoMultipla.value) {
    valorFiltro.value = valorRegistro;
    valoresSelecionados.value = [valorRegistro];
    return;
  }

  const valoresAtuais = Array.isArray(valorFiltro.value) ? [...valorFiltro.value] : [];
  const registroJaSelecionado = valoresAtuais.some((pValor) => isMesmoValor(pValor, valorRegistro));

  const novosValores = registroJaSelecionado
    ? valoresAtuais.filter((pValor) => !isMesmoValor(pValor, valorRegistro))
    : [...valoresAtuais, valorRegistro];

  valorFiltro.value = novosValores;
  valoresSelecionados.value = novosValores;
}

function handlePesquisarRegistros(pTermoPesquisa: string): void {
  termoPesquisa.value = pTermoPesquisa;
}

async function handleBuscarRegistros(
  pPayload: IGenericListFetchPayload,
): Promise<TGenericListFetchResponse<TRegistroConsulta>> {
  const resultado = await configuracaoConsulta.value.buscarRegistros({
    campo: String(props.campoSelecionado?.valor ?? ''),
    condicao: props.condicao,
    limite: pPayload.limit,
    proximaEntrada: pPayload.nextEntry,
    termoPesquisa: termoPesquisa.value,
  });

  const resultadoNormalizado = normalizarResultadoConsulta(resultado);

  return {
    items: resultadoNormalizado.registros,
    nextEntry: resultadoNormalizado.proximaEntrada,
    hasMore: resultadoNormalizado.possuiMais,
  };
}

// Computadas
const configuracaoConsulta = computed<IConsultaRegistrosFiltro<TRegistroConsulta>>(() => {
  return props.campoSelecionado?.consultaRegistros as IConsultaRegistrosFiltro<TRegistroConsulta>;
});

const limiteConsulta = computed(() => configuracaoConsulta.value?.limiteInicial ?? 10);
const textoVazio = computed(() => configuracaoConsulta.value?.textoVazio ?? 'Nenhum registro encontrado.');
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
