<template>
  <v-container
    class="fill-height pb-0 overflow-hidden"
    fluid
  >
    <GenericView
      :contexto="CONTEXTO_LISTA_ERROS"
      :serviceFetch="buscarErros"
      :serviceExportacao="CErroService.consultarTodosRegistros"
      :colunasExportacao="MAPEAMENTO_TABELA_ERROS"
      :exibirNovoRegistro="false"
      nomeArquivoExportacao="erros-sistema"
      itemKey="idError"
      textoVazio="Nenhum erro registrado."
      textoFinal="Todos os erros foram carregados."
    >
      <template #default="{ items }">
        <v-expansion-panels class="pa-1">
          <GenericInfiniteListItem
            v-for="erro in items as IErros[]"
            :key="erro.idError"
            :item="erro"
            itemKey="idError"
            class="w-100 mb-2"
          >
            <v-expansion-panel class="border rounded">
              <v-expansion-panel-title>
                <div class="d-flex align-center w-100 pr-4">
                  <v-icon
                    :color="resolverCorStatus(erro.httpStatusCode)"
                    icon="mdi-alert-circle-outline"
                    size="24"
                    class="mr-3"
                  />

                  <span
                    class="font-weight-bold text-primary text-truncate text-body-2"
                    style="max-width: calc(100% - 100px)"
                  >
                    #{{ erro.idError }} - {{ formatarTituloMensagem(erro.mensagem) }}
                  </span>

                  <v-chip
                    :color="resolverCorStatus(erro.httpStatusCode)"
                    size="small"
                    variant="tonal"
                    class="ml-auto"
                  >
                    HTTP {{ erro.httpStatusCode }}
                  </v-chip>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="pt-2 bg-grey-lighten-4">
                <DetalhesLogErro :erro="erro" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </GenericInfiniteListItem>
        </v-expansion-panels>
      </template>
    </GenericView>
  </v-container>
</template>

<script setup lang="ts">
// Types e Interfaces
// Mapeamentos
import { MAPEAMENTO_TABELA_ERROS } from '@/models/model/errors/MapeamentoTabelaErros';
import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IErros } from '@/models/model/errors/IErros';

// Services
import { CErroService } from '@/services/CErroService';

import DetalhesLogErro from '@/components/errors/DetalhesLogErro.vue';
import GenericInfiniteListItem from '@/components/layouts/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
// Componentes
import GenericView from '@/components/layouts/generic/GenericView.vue';

// Constantes
const CONTEXTO_LISTA_ERROS = 'lista-erros';

// Funções
/**
 * @description Consulta a listagem paginada de erros de sistema através do serviço de falhas.
 * @param pPayload Parâmetros contendo o limite, cursor e ordem para paginação.
 * @returns Retorna a resposta contendo a lista de erros e status da paginação.
 */
async function buscarErros(pPayload: IConsultaRegistros): Promise<IResultadoConsultaRegistros<IErros>> {
  return CErroService.consultar(pPayload);
}

/**
 * @description Determina a cor visual (classe de cor do Vuetify) correspondente ao status HTTP.
 * @param pStatus O código HTTP de status do erro.
 * @returns String contendo o nome da cor de feedback do Vuetify.
 */
function resolverCorStatus(pStatus: number): string {
  if (pStatus >= 500) {
    return 'error';
  }

  if (pStatus >= 400) {
    return 'warning';
  }

  return 'info';
}

/**
 * @description Trunca a mensagem de erro a 100 caracteres com reticências para melhor visualização no título.
 * @param pMensagem A mensagem de erro original completa.
 * @returns A string formatada limitada a 100 caracteres.
 */
function formatarTituloMensagem(pMensagem: string): string {
  if (!pMensagem) {
    return '';
  }

  return pMensagem.length > 100 ? pMensagem.substring(0, 100) + '...' : pMensagem;
}
</script>
