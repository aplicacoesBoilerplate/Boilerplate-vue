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
      :serviceFetch="consultarRegistros"
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
              v-for="registro in items as TRegistroVinculo[]"
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

<script setup lang="ts" generic="TRegistroVinculo extends object">
// Ecossistema Vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';

// Componentes
import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';
import GenericInfiniteList from '@/components/layouts/generic/GenericInfiniteList/GenericInfiniteList.vue';

type TPayloadConsultaVinculos<TRegistro extends object> = IConsultaRegistros<TRegistro> & {
  termoPesquisa: string;
};

/**
 * @description Define as propriedades da consulta paginada de vínculos.
 * @property {string} contexto - Contexto usado pela lista genérica para cache e paginação.
 * @property {string} titulo - Título exibido acima da consulta.
 * @property {string} subtitulo - Texto auxiliar exibido abaixo do título.
 * @property {string} rotuloPesquisa - Rótulo do campo de busca.
 * @property {string} iconePesquisa - Ícone do campo de busca.
 * @property {string} textoVazio - Texto exibido quando não houver registros.
 * @property {string} textoFinal - Texto exibido quando todas as páginas forem carregadas.
 * @property {string} iconeVazio - Ícone exibido no estado vazio.
 * @property {number} limite - Limite de registros por página.
 * @property {string} atributoChave - Campo usado no fallback para obter a chave do registro.
 * @property {string} atributoTitulo - Campo usado no fallback para obter o título do registro.
 * @property {string} atributoSubtitulo - Campo usado no fallback para obter o subtítulo do registro.
 * @property {(TPayloadConsultaVinculos<TRegistroVinculo>) => Promise<IRespostaConsultaRegistros<TRegistroVinculo>>} buscarRegistros - Método responsável por consultar os registros com paginação e termo local.
 */
type TProps = {
  contexto: string;
  titulo: string;
  subtitulo?: string;
  rotuloPesquisa?: string;
  iconePesquisa?: string;
  textoVazio?: string;
  textoFinal?: string;
  iconeVazio?: string;
  limite?: number;
  atributoChave?: string;
  atributoTitulo?: string;
  atributoSubtitulo?: string;
  buscarRegistros: (
    pPayload: TPayloadConsultaVinculos<TRegistroVinculo>
  ) => Promise<IRespostaConsultaRegistros<TRegistroVinculo>>;
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
 * @description Atualiza o termo que será enviado para a próxima consulta paginada.
 * @param pTermoPesquisa - Valor que será utilizado na consulta.
 */
function pesquisar(pTermoPesquisa: string): void {
  termoPesquisa.value = pTermoPesquisa;
}

/**
 * @description Encapsula o payload da lista genérica adicionando o termo digitado no facilitador.
 * @param pPayload - Montagem do body da requisição de consulta.
 * @returns Retorna a resposta da requisição.
 */
async function consultarRegistros(
  pPayload: IConsultaRegistros<TRegistroVinculo>,
): Promise<IRespostaConsultaRegistros<TRegistroVinculo>> {
  return props.buscarRegistros({
    ...pPayload,
    termoPesquisa: termoPesquisa.value,
  });
}

/**
 * @description Obtém a chave do registro para o fallback de renderização da lista.
 * @param pRegistro - Registro que será usado para obter a chave.
 * @returns Atributo chave do objeto de registro.
 */
function obterChaveRegistro(pRegistro: TRegistroVinculo): unknown {
  return (pRegistro as Record<string, unknown>)[props.atributoChave];
}

/**
 * @description Obtém o título do registro para o fallback de renderização da lista.
 * @param pRegistro - Registro que será usado para obter o Título.
 * @returns Atributo título.
 */
function obterTituloRegistro(pRegistro: TRegistroVinculo): string {
  return String((pRegistro as Record<string, unknown>)[props.atributoTitulo] ?? '');
}

/**
 * @description Obtém o subtítulo do registro para o fallback de renderização da lista.
 * @param pRegistro - Registro que será usado para obter o Subtítulo.
 * @returns Atributo Subtítulo.
 */
function obterSubtituloRegistro(pRegistro: TRegistroVinculo): string {
  return String((pRegistro as Record<string, unknown>)[props.atributoSubtitulo] ?? '');
}

// Computadas
const contextoConsulta = computed(() => {
  return [props.contexto, termoPesquisa.value || 'sem-pesquisa'].join(':');
});

const rotuloPesquisaPadrao = computed(
  () => props.rotuloPesquisa ?? t('forms.consultaVinculosFormulario.rotuloPesquisa'),
);

const textoVazioPadrao = computed(() => props.textoVazio ?? t('forms.consultaVinculosFormulario.textoVazio'));

const textoFinalPadrao = computed(() => props.textoFinal ?? t('forms.consultaVinculosFormulario.textoFinal'));
</script>
