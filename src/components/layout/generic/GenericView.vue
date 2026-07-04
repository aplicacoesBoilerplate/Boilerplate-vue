<template>
  <v-card
    class="mb-3 pa-3 bg-surface w-100"
    elevation="4"
    rounded="te-xl bs-xl"
  >
    <section class="w-100">
      <header
        v-if="titulo || $slots.header"
        class="mb-4"
      >
        <slot
          name="header"
          :titulo="titulo"
        >
          <h1 class="text-h4 font-weight-bold">{{ titulo }}</h1>
        </slot>
      </header>

      <GenericInfiniteList
        ref="infiniteListRef"
        :cacheTtlMs="cacheTtlMs"
        :contexto="contexto"
        :textoVazio="textoVazio"
        :textoFinal="textoFinal"
        :textoError="textoError"
        :limite="limite"
        :ordemInicial="ordemInicial"
        :itemKey="itemKey"
        :opcoesLimite="opcoesLimite"
        :serviceFetch="serviceFetch"
        :storage="storage"
      >
        <!-- v-if="$slots['list-header']" -->
        <template #header="slotProps">
          <slot
            name="list-header"
            v-bind="slotProps"
          >
            <div class="mb-3 d-flex align-center justify-start">
              <v-tooltip
                :text="slotProps.ordemAtual === 'asc' ? 'Ordenar decrescente' : 'Ordenar crescente'"
                location="bottom"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    :icon="slotProps.ordemAtual === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
                    color="primary"
                    size="x-small"
                    variant="tonal"
                    @click="slotProps.toggleOrder"
                  />
                </template>
              </v-tooltip>

              <BtnActionDrawer
                top="28px"
                right="6px"
                width="160px"
                absolute
              >
                <div class="d-flex flex-row ga-2">
                  <slot name="list-header-actions" />

                  <MenuExportacaoDados
                    v-if="exibirExportacao"
                    :contexto="contexto"
                    :metodo="metodoExportacao"
                    :parametros="parametrosExportacao"
                    :colunas="colunasExportacao"
                    :nomeArquivo="nomeArquivoExportacao || contexto"
                    :ordem="ordemInicial"
                  />

                  <v-tooltip
                    :text="'Novo Registro'"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <slot
                        name="activator-novo-registro"
                        :handleNovoRegistro="() => handleNovoRegistro({ modoEdicao: false })"
                        :tooltipProps="props"
                      >
                        <v-btn
                          v-bind="props"
                          color="primary"
                          icon="mdi-plus"
                          size="x-small"
                          @click="handleNovoRegistro({ modoEdicao: false })"
                        />
                      </slot>
                    </template>
                  </v-tooltip>
                </div>
              </BtnActionDrawer>
            </div>
          </slot>
        </template>

        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>

        <template
          v-if="$slots.empty"
          #empty="slotProps"
        >
          <slot
            name="empty"
            v-bind="slotProps"
          />
        </template>

        <template
          v-if="$slots.error"
          #error
        >
          <slot name="error" />
        </template>
      </GenericInfiniteList>
    </section>
  </v-card>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, ref } from 'vue';

// Types e Interfaces
import type { IGenericListFetchPayload, TGenericListFetchResponse, TOrdem } from '@/models/components/IGenericListContext';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TMetodoExportacaoDados } from '@/models/components/IExportacaoDados';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

// Components
import GenericInfiniteList from './GenericInfiniteList/GenericInfiniteList.vue';
import MenuExportacaoDados from './fixtures/MenuExportacaoDados.vue';
import BtnActionDrawer from '@/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue';

/**
 * @property {number} cacheTtlMs - Tempo de vida do contexto salvo em storage antes de a lista precisar recarregar.
 * @property {string} contexto - Identificador unico do contexto usado pela store e pela chave no storage.
 * @property {string} textoVazio - Texto exibido quando a lista ainda nao possui itens.
 * @property {string} textoFinal - Texto exibido quando todos os registros ja foram carregados.
 * @property {string} textoError - Texto exibido quando o carregamento do infinite scroll falhar.
 * @property {number} limite - Limite inicial de registros por requisicao.
 * @property {TOrdem} ordemInicial - Ordenacao inicial padrão.
 * @property {string} itemKey - Campo estavel do item usado para montar seletor de restauracao de scroll.
 * @property {number[]} opcoesLimite - Opcoes disponiveis no seletor de limite da lista.
 * @property {function} serviceFetch - Funcao responsavel por buscar a proxima pagina de registros.
 * @property {function} serviceExportacao - Metodo usado para exportar todos os registros; quando ausente, usa o serviceFetch da lista.
 * @property {object} parametrosExportacao - Parametros adicionais enviados somente durante a exportacao.
 * @property {object} colunasExportacao - Colunas usadas para montar cabecalhos e valores dos arquivos exportados.
 * @property {string} nomeArquivoExportacao - Nome base do arquivo exportado.
 * @property {boolean} exibirExportacao - Controla se o menu de exportacao sera exibido no drawer de acoes.
 * @property {string} storage - Define onde o contexto sera persistido; em listas temporarias o padrao e session.
 * @property {string} titulo - Titulo simples exibido quando o slot header nao for informado.
 */
type TProps = {
  cacheTtlMs?: number;
  contexto: string;
  textoVazio?: string;
  textoFinal?: string;
  textoError?: string;
  limite?: number;
  ordemInicial?: TOrdem;
  itemKey?: string;
  opcoesLimite?: number[];
  serviceFetch: (payload: IGenericListFetchPayload) => Promise<TGenericListFetchResponse>;
  serviceExportacao?: TMetodoExportacaoDados;
  parametrosExportacao?: Record<string, unknown>;
  colunasExportacao?: IHeadersDataTable[];
  nomeArquivoExportacao?: string;
  exibirExportacao?: boolean;
  storage?: TManagerStorageLocation;
  titulo?: string;
};
const props = withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  textoVazio: 'Nenhum registro encontrado.',
  textoFinal: 'Todos os registros foram carregados.',
  textoError: 'Não foi possível carregar os registros.',
  limite: undefined,
  ordemInicial: undefined,
  itemKey: undefined,
  opcoesLimite: () => [10, 25, 50, 100],
  serviceExportacao: undefined,
  parametrosExportacao: () => ({}),
  colunasExportacao: () => [],
  nomeArquivoExportacao: '',
  exibirExportacao: true,
  storage: 'session',
  titulo: '',
});

type TEmits = {
  novoRegistro: [{ modoEdicao: boolean }];
};
const emits = defineEmits<TEmits>();

// Reativas
const infiniteListRef = ref<InstanceType<typeof GenericInfiniteList> | null>(null);

// Funções
function handleNovoRegistro(pParams: { modoEdicao: boolean }): void {
  emits('novoRegistro', pParams);
}

// Computadas
const metodoExportacao = computed<TMetodoExportacaoDados>(() => props.serviceExportacao ?? props.serviceFetch);

// Expose
defineExpose({
  infiniteListRef, // Expõe a lista para pages especificas acionarem reload apos filtros ou ações externas.
  loadMore: (...args: Parameters<InstanceType<typeof GenericInfiniteList>['loadMore']>) =>
    infiniteListRef.value?.loadMore(...args),
  resetAndLoad: () => infiniteListRef.value?.resetAndLoad(),
  inserirItem: (pItem: unknown) => infiniteListRef.value?.inserirItem(pItem),
  atualizarItem: <TItem extends object>(
    pIdField: keyof TItem,
    pIdValue: TItem[keyof TItem],
    pNewValues: Partial<TItem>,
  ) => infiniteListRef.value?.atualizarItem(pIdField, pIdValue, pNewValues),
  removerItem: <TItem extends object>(
    pIdField: keyof TItem,
    pIdValue: TItem[keyof TItem],
  ) => infiniteListRef.value?.removerItem(pIdField, pIdValue),
});
</script>
