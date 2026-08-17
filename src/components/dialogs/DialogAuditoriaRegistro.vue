<template>
  <BaseDialog
    v-model:exibirDialog="dialogAuditoriaOpen"
    :maxWidth="420"
    :titulo="t('common.audit.title')"
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
          :title="t('common.audit.createdAt')"
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
          :title="t('common.audit.createdBy')"
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
          :title="t('common.audit.updatedAt')"
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
          :title="t('common.audit.updatedBy')"
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
        :text="t('common.actions.close')"
        color="primary"
        variant="tonal"
        class="ml-auto"
        @click="onFechar"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

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
const { auditoria = undefined, tooltip: tooltipPersonalizado = undefined } = defineProps<TProps>();

const { t } = useI18n();
const tooltip = computed(() => tooltipPersonalizado ?? t('common.audit.tooltip'));

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
  if (pId) return t('common.audit.userReference', { id: pId });

  return t('common.audit.system');
}
</script>
