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
          title="Criado em"
          :subtitle="formatarData(auditoria?.criadoEm)"
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
          title="Criado por"
          :subtitle="formatarResponsavel(auditoria?.criadoPor, auditoria?.criadoPorReferencia)"
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
          title="Última edição"
          :subtitle="formatarData(auditoria?.atualizadoEm)"
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
          title="Editado por"
          :subtitle="formatarResponsavel(auditoria?.atualizadoPor, auditoria?.atualizadoPorReferencia)"
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
import { useI18n } from 'vue-i18n';

// Types
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';

// Utils
import { CFormatters } from '@/classes/Utils/CFormatters';

// Componentes
import BaseDialog from './base/BaseDialog.vue';

type TProps = {
  auditoria?: IAuditoriaRegistro;
  tooltip?: string;
};

const props = withDefaults(defineProps<TProps>(), {
  auditoria: undefined,
  tooltip: 'Visualizar auditoria',
});

// Composables
const { locale } = useI18n();

// Reativas
const dialogAuditoriaOpen = ref(false);

// Funções
function formatarData(pData?: string | Date | null): string {
  if (!pData) {
    return '-';
  }

  return CFormatters.formatarDataHora(pData, locale.value, true);
}

function formatarResponsavel(pId?: number | null, pReferencia?: string | null): string {
  if (pReferencia) {
    return pReferencia;
  }

  if (pId) {
    return `Usuário #${pId}`;
  }

  return 'Sistema';
}
</script>
