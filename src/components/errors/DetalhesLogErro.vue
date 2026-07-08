<template>
  <div class="detalhes-log-erro">
    <v-table
      class="border rounded bg-surface"
      density="compact"
    >
      <tbody>
        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap" style="width: 180px;">
            <v-icon icon="mdi-text-box-search" size="18" class="mr-2 text-primary" />
            Mensagem Completa
          </td>
          <td class="py-2 text-body-2 select-all font-weight-medium">
            {{ erro.mensagem }}
          </td>
        </tr>

        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap">
            <v-icon icon="mdi-calendar-clock" size="18" class="mr-2 text-primary" />
            Data e Hora
          </td>
          <td class="py-2 text-body-2">
            {{ formatarData(erro.dataHora) }}
          </td>
        </tr>

        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap">
            <v-icon icon="mdi-code-class" size="18" class="mr-2 text-primary" />
            Classe
          </td>
          <td class="py-2 text-body-2 text-mono font-weight-medium">
            {{ erro.classe || '-' }}
          </td>
        </tr>

        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap">
            <v-icon icon="mdi-code-braces" size="18" class="mr-2 text-primary" />
            Método
          </td>
          <td class="py-2 text-body-2 text-mono">
            {{ erro.metodo || '-' }}
          </td>
        </tr>

        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap">
            <v-icon icon="mdi-format-list-numbered" size="18" class="mr-2 text-primary" />
            Linha
          </td>
          <td class="py-2 text-body-2 text-mono">
            {{ erro.linha || '-' }}
          </td>
        </tr>

        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap">
            <v-icon icon="mdi-file-code-outline" size="18" class="mr-2 text-primary" />
            Arquivo
          </td>
          <td class="py-2 text-body-2 text-mono">
            {{ erro.arquivo || '-' }}
          </td>
        </tr>

        <tr>
          <td class="font-weight-bold py-2 text-medium-emphasis border-bottom text-no-wrap">
            <v-icon icon="mdi-account" size="18" class="mr-2 text-primary" />
            Usuário Responsável
          </td>
          <td class="py-2 text-body-2">
            {{ erro.usuarioReferencia || 'SISTEMA' }}
            <span v-if="erro.idUsuario" class="text-medium-emphasis"> (ID: #{{ erro.idUsuario }})</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { IErros } from '@/models/model/errors/IErros';

// Utils
import { CFormatters } from '@/classes/Utils/CFormatters';

/**
 * @description Contrato do componente DetalhesLogErro.
 * @property {IErros} erro - Objeto contendo os dados detalhados da falha para auditoria.
 */
type TProps = {
  erro: IErros;
};

const props = defineProps<TProps>();

// Composables
const { locale } = useI18n();

// Funções
/**
 * @description Formata a data recebida no formato regional configurado na aplicação.
 * @param pData A data no formato string ou Date.
 * @returns A data formatada para exibição.
 */
function formatarData(pData: string | Date): string {
  return CFormatters.formatarDataHora(pData, locale.value, true);
}
</script>

<style scoped lang="scss">
.text-mono {
  font-family: monospace;
}
.select-all {
  user-select: all;
}
</style>
