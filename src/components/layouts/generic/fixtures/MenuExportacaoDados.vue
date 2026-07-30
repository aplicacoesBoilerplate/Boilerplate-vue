<template>
  <v-menu
    v-model="exibirMenu"
    :closeOnContentClick="false"
    location="bottom end"
  >
    <template #activator="{ props: menuProps }">
      <v-tooltip
        :text="t('components.menuExportacaoDados.tooltip')"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="mergeProps(menuProps, tooltipProps)"
            :disabled="!podeExportar"
            :loading="exportando"
            color="secondary"
            icon="mdi-export"
            size="x-small"
            variant="tonal"
          />
        </template>
      </v-tooltip>
    </template>

    <v-card
      class="py-1"
      minWidth="220"
      rounded="lg"
    >
      <v-list
        density="compact"
        nav
      >
        <v-list-subheader>{{ t('components.menuExportacaoDados.titulo') }}</v-list-subheader>

        <v-list-item
          v-for="opcao in opcoesExportacao"
          :key="opcao.formato"
          :disabled="exportando"
          :prependIcon="opcao.icone"
          :subtitle="opcao.descricao"
          :title="opcao.titulo"
          color="primary"
          rounded="lg"
          @click="exportar(opcao.formato)"
        >
          <template
            v-if="formatoCarregando === opcao.formato"
            #append
          >
            <v-progress-circular
              color="primary"
              size="18"
              width="2"
              indeterminate
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, inject, mergeProps, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TFormatoExportacaoDados, TMetodoExportacaoDados } from '@/models/components/IExportacaoDados';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';

import { useExportacaoDados } from '@/composables/useExportacaoDados';
import { usePermissoesRbac } from '@/composables/usePermissoesRbac';

type TProps = {
  contexto: string;
  metodo: TMetodoExportacaoDados;
  parametros?: Record<string, unknown>;
  colunas?: IHeadersDataTable[];
  nomeArquivo?: string;
};

const props = withDefaults(defineProps<TProps>(), {
  parametros: () => ({}),
  colunas: () => [],
  nomeArquivo: 'exportacao',
});

const { exportando, exportarDados } = useExportacaoDados();
const { possuiPermissaoGeral, notificarPermissaoNegada } = usePermissoesRbac();
const { t } = useI18n();

const manterDrawerAberto = inject<((pValor: boolean) => void) | undefined>('drawerKeepOpen', undefined);

const exibirMenu = ref(false);
const formatoCarregando = ref<TFormatoExportacaoDados | null>(null);

const manterAberto = computed(() => exibirMenu.value);
const podeExportar = computed(() => possuiPermissaoGeral('exportarDados'));
const opcoesExportacao = computed<
  { formato: TFormatoExportacaoDados; titulo: string; descricao: string; icone: string }[]
>(() => [
  {
    formato: 'txt',
    titulo: t('components.menuExportacaoDados.formatos.txt.titulo'),
    descricao: t('components.menuExportacaoDados.formatos.txt.descricao'),
    icone: 'mdi-file-document-outline',
  },
  {
    formato: 'pdf',
    titulo: t('components.menuExportacaoDados.formatos.pdf.titulo'),
    descricao: t('components.menuExportacaoDados.formatos.pdf.descricao'),
    icone: 'mdi-file-pdf-box',
  },
  {
    formato: 'excel',
    titulo: t('components.menuExportacaoDados.formatos.excel.titulo'),
    descricao: t('components.menuExportacaoDados.formatos.excel.descricao'),
    icone: 'mdi-file-excel-outline',
  },
]);

async function exportar(pFormato: TFormatoExportacaoDados): Promise<void> {
  if (!podeExportar.value) {
    notificarPermissaoNegada('Você não tem permissão para exportar dados.');
    exibirMenu.value = false;
    return;
  }

  formatoCarregando.value = pFormato;

  try {
    await exportarDados({
      formato: pFormato,
      contexto: props.contexto,
      metodo: props.metodo,
      parametros: props.parametros,
      colunas: props.colunas,
      nomeArquivo: props.nomeArquivo,
    });
  } catch {
  } finally {
    formatoCarregando.value = null;
  }
}

watch(manterAberto, (pManterAberto) => {
  manterDrawerAberto?.(pManterAberto);
});

onBeforeUnmount(() => {
  manterDrawerAberto?.(false);
});
</script>
