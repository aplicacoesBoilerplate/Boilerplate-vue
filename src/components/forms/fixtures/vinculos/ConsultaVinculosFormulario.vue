<template>
  <div
    class="d-flex flex-column ga-3"
    style="min-height: 0"
  >
    <div>
      <div class="text-subtitle-1 font-weight-bold">{{ titulo }}</div>
      <div
        v-if="subtitulo"
        class="text-caption text-medium-emphasis"
      >
        {{ subtitulo }}
      </div>
    </div>

    <InputDebouncer
      v-model:pesquisaCampo="pesquisa"
      :label="rotuloPesquisaPadrao"
      :icon="iconePesquisa"
      variant="outlined"
      density="compact"
      @onSearch="pesquisar"
    />

    <GenericInfiniteList
      :key="contextoConsulta"
      :cacheTtlMs="CACHE_TTL_CONSULTA_MS"
      :contexto="contextoConsulta"
      :limite="limite"
      :opcoesLimite="[limite]"
      :serviceFetch="buscarRegistros"
      :textoVazio="textoVazioPadrao"
      :textoFinal="textoFinalPadrao"
      :usarFiltrosGlobais="false"
      storage="session"
      class="flex-grow-1"
      style="min-height: 260px"
    >
      <template #default="{ items, loading }">
        <slot
          :items="items as TRegistroVinculo[]"
          :loading="loading"
          :termoPesquisa="termoPesquisa"
        >
          <v-list
            v-if="items.length"
            class="pa-0"
            density="compact"
          >
            <v-list-item
              v-for="registro in (items as TRegistroVinculo[])"
              :key="String(obterChaveRegistro(registro))"
            >
              <v-list-item-title>{{ obterTituloRegistro(registro) }}</v-list-item-title>
              <v-list-item-subtitle>{{ obterSubtituloRegistro(registro) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </slot>
      </template>

      <template #empty="{ items, loading }">
        <slot name="empty">
          <div
            v-if="loading"
            class="d-flex flex-column align-center justify-center text-center py-8"
          >
            <v-progress-circular
              color="primary"
              size="32"
              indeterminate
            />
          </div>

          <div
            v-else
            class="d-flex flex-column align-center justify-center text-center text-medium-emphasis py-8"
          >
            <v-icon
              :icon="items.length ? 'mdi-database-check' : iconeVazio"
              size="40"
              class="mb-2"
            />
            <span>{{ items.length ? textoFinalPadrao : textoVazioPadrao }}</span>
          </div>
        </slot>
      </template>
    </GenericInfiniteList>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Componentes
import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';
import GenericInfiniteList from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteList.vue';

type TRegistroVinculo = object;

type TPayloadConsultaVinculos = IGenericListFetchPayload & {
  /**
   * Termo digitado na busca local do facilitador.
   */
  termoPesquisa: string;
};

type TProps = {
  /**
   * Contexto usado pela lista genérica para cache e paginação.
   */
  contexto: string;

  /**
   * Título exibido acima da consulta.
   */
  titulo: string;

  /**
   * Texto auxiliar exibido abaixo do título.
   */
  subtitulo?: string;

  /**
   * Rótulo do campo de busca.
   */
  rotuloPesquisa?: string;

  /**
   * Ícone do campo de busca.
   */
  iconePesquisa?: string;

  /**
   * Texto exibido quando não houver registros.
   */
  textoVazio?: string;

  /**
   * Texto exibido quando todas as páginas forem carregadas.
   */
  textoFinal?: string;

  /**
   * Ícone exibido no estado vazio.
   */
  iconeVazio?: string;

  /**
   * Limite de registros por página.
   */
  limite?: number;

  /**
   * Campo usado no fallback para obter a chave do registro.
   */
  atributoChave?: string;

  /**
   * Campo usado no fallback para obter o título do registro.
   */
  atributoTitulo?: string;

  /**
   * Campo usado no fallback para obter o subtítulo do registro.
   */
  atributoSubtitulo?: string;

  /**
   * Método responsável por consultar os registros com paginação e termo local.
   */
  buscarRegistros: (pPayload: TPayloadConsultaVinculos) => Promise<TGenericListFetchResponse<TRegistroVinculo>>;
};

const props = withDefaults(defineProps<TProps>(), {
  subtitulo: '',
  rotuloPesquisa: undefined,
  iconePesquisa: 'mdi-database-search',
  textoVazio: undefined,
  textoFinal: undefined,
  iconeVazio: 'mdi-database-off-outline',
  limite: 10,
  atributoChave: 'id',
  atributoTitulo: 'nome',
  atributoSubtitulo: 'descricao',
});

// Composables
const { t } = useI18n();

// Constantes
const CACHE_TTL_CONSULTA_MS = 60 * 1000;

// Reativas
const pesquisa = ref<string | null>('');
const termoPesquisa = ref('');

// Funções
/**
 * Atualiza o termo que será enviado para a próxima consulta paginada.
 */
function pesquisar(pTermoPesquisa: string): void {
  termoPesquisa.value = pTermoPesquisa;
}

/**
 * Encapsula o payload da lista genérica adicionando o termo digitado no facilitador.
 */
async function buscarRegistros(
  pPayload: IGenericListFetchPayload,
): Promise<TGenericListFetchResponse<TRegistroVinculo>> {
  return props.buscarRegistros({
    ...pPayload,
    termoPesquisa: termoPesquisa.value,
  });
}

/**
 * Obtém a chave do registro para o fallback de renderização da lista.
 */
function obterChaveRegistro(pRegistro: TRegistroVinculo): unknown {
  return (pRegistro as Record<string, unknown>)[props.atributoChave];
}

/**
 * Obtém o título do registro para o fallback de renderização da lista.
 */
function obterTituloRegistro(pRegistro: TRegistroVinculo): string {
  return String((pRegistro as Record<string, unknown>)[props.atributoTitulo] ?? '');
}

/**
 * Obtém o subtítulo do registro para o fallback de renderização da lista.
 */
function obterSubtituloRegistro(pRegistro: TRegistroVinculo): string {
  return String((pRegistro as Record<string, unknown>)[props.atributoSubtitulo] ?? '');
}

// Computadas
const contextoConsulta = computed(() => {
  return [
    props.contexto,
    termoPesquisa.value || 'sem-pesquisa',
  ].join(':');
});

const rotuloPesquisaPadrao = computed(() => props.rotuloPesquisa ?? t('forms.consultaVinculosFormulario.rotuloPesquisa'));

const textoVazioPadrao = computed(() => props.textoVazio ?? t('forms.consultaVinculosFormulario.textoVazio'));

const textoFinalPadrao = computed(() => props.textoFinal ?? t('forms.consultaVinculosFormulario.textoFinal'));
</script>
