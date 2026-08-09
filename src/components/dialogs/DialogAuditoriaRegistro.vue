<template>
  <BaseDialog
    v-model:exibirDialog="dialogAuditoriaOpen"
    :maxWidth="420"
    titulo="Auditoria do registro"
    iconePrependTitulo="mdi-history"
  >
    <template #activator="{ props: dialogProps }">
      <v-tooltip
        :text="tooltip"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="mergeProps(dialogProps, tooltipProps)"
            icon="mdi-history"
            variant="text"
            color="secondary"
            size="small"
          />
        </template>
      </v-tooltip>
    </template>

    <template #content>
      <v-list density="compact">
        <v-list-item
          :subtitle="formatarData(auditoria?.criadoEm)"
          title="Criado em"
        >
          <template #prepend>
            <v-icon
              icon="mdi-calendar-plus"
              color="success"
              class="mr-3"
            />
          </template>
        </v-list-item>

        <v-list-item
          :subtitle="formatarResponsavel(auditoria?.criadoPor, auditoria?.criadoPorReferencia)"
          title="Criado por"
        >
          <template #prepend>
            <v-icon
              icon="mdi-account-plus"
              color="success"
              class="mr-3"
            />
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-item
          :subtitle="formatarData(auditoria?.atualizadoEm)"
          title="Última edição"
        >
          <template #prepend>
            <v-icon
              icon="mdi-calendar-edit"
              color="info"
              class="mr-3"
            />
          </template>
        </v-list-item>

        <v-list-item
          :subtitle="formatarResponsavel(auditoria?.atualizadoPor, auditoria?.atualizadoPorReferencia)"
          title="Editado por"
        >
          <template #prepend>
            <v-icon
              icon="mdi-account-edit"
              color="info"
              class="mr-3"
            />
          </template>
        </v-list-item>
      </v-list>
    </template>

    <template #actions="{ onFechar }">
      <v-btn
        color="primary"
        variant="tonal"
        text="Fechar"
        class="ml-auto"
        @click="onFechar"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { mergeProps, ref } from 'vue';

// Models
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';

// Utils
import { CFormatters } from '@/classes/Utils/CFormatters';

// Componentes
import BaseDialog from './base/BaseDialog.vue';

type TProps = {
  auditoria?: IAuditoriaRegistro;
  tooltip?: string;
};
withDefaults(defineProps<TProps>(), {
  auditoria: undefined,
  tooltip: 'Visualizar auditoria',
});

// Reativas
const dialogAuditoriaOpen = ref(false);

// Funções
function formatarData(pData?: string | Date | null): string {
  if (!pData) {
    return '-';
  }

  return CFormatters.formatarDataHora(pData, true);
}

function formatarResponsavel(pId?: number | null, pReferencia?: string | null): string {
  if (pReferencia) return pReferencia;
  if (pId) return `Usuário #${pId}`;

  return 'Sistema';
}
</script>
