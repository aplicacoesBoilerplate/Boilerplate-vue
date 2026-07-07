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
          :prepend-icon="opcao.icone"
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
// Ecossistema Vue
import { computed, inject, mergeProps, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TOrdem } from '@/models/components/IGenericListContext';
import type { TFormatoExportacaoDados, TMetodoExportacaoDados } from '@/models/components/IExportacaoDados';

// Composables
import { useExportacaoDados } from '@/composables/useExportacaoDados';

type TProps = {
  /**
   * Contexto da listagem usada na exportação.
   */
  contexto: string;

  /**
   * Método que consulta os registros paginados.
   */
  metodo: TMetodoExportacaoDados;

  /**
   * Parâmetros específicos do endpoint exportado.
   */
  parametros?: Record<string, unknown>;

  /**
   * Colunas usadas para gerar cabeçalhos e valores dos arquivos.
   */
  colunas?: IHeadersDataTable[];

  /**
   * Nome base do arquivo gerado.
   */
  nomeArquivo?: string;

  /**
   * Ordenação usada nas consultas paginadas da exportação.
   */
  ordem?: TOrdem;
};

// Props
const props = withDefaults(defineProps<TProps>(), {
  parametros: () => ({}),
  colunas: () => [],
  nomeArquivo: 'exportacao',
  ordem: 'asc',
});

// Composables
const { exportando, exportarDados } = useExportacaoDados();
const { t } = useI18n();

// Injeções
const manterDrawerAberto = inject<((pValor: boolean) => void) | undefined>('drawerKeepOpen', undefined);

// Reativas
const exibirMenu = ref(false);
const formatoCarregando = ref<TFormatoExportacaoDados | null>(null);

// Computadas
const manterAberto = computed(() => exibirMenu.value);
const opcoesExportacao = computed<{ formato: TFormatoExportacaoDados; titulo: string; descricao: string; icone: string }[]>(() => [
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

// Funções
async function exportar(pFormato: TFormatoExportacaoDados): Promise<void> {
  formatoCarregando.value = pFormato;

  try {
    await exportarDados({
      formato: pFormato,
      contexto: props.contexto,
      metodo: props.metodo,
      parametros: props.parametros,
      colunas: props.colunas,
      nomeArquivo: props.nomeArquivo,
      ordem: props.ordem,
    });
  } catch {
    // O feedback de erro é centralizado no composable de exportação.
  } finally {
    formatoCarregando.value = null;
  }
}

// Observadores
watch(manterAberto, (pManterAberto) => {
  manterDrawerAberto?.(pManterAberto);
});

// Lifecycle Hooks
onBeforeUnmount(() => {
  manterDrawerAberto?.(false);
});
</script>
