<template>
  <v-menu
    v-model="exibirMenu"
    :closeOnContentClick="false"
    location="bottom end"
  >
    <template #activator="{ props: menuProps }">
      <v-tooltip
        text="Exportar dados"
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
        <v-list-subheader>Exportar</v-list-subheader>

        <v-list-item
          v-for="opcao in OPCOES_EXPORTACAO"
          :key="opcao.formato"
          :disabled="exportando"
          :prepend-icon="opcao.icone"
          :subtitle="opcao.descricao"
          :title="opcao.titulo"
          color="primary"
          rounded="lg"
          @click="handleExportar(opcao.formato)"
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

// Constantes
const OPCOES_EXPORTACAO: { formato: TFormatoExportacaoDados; titulo: string; descricao: string; icone: string }[] = [
  {
    formato: 'txt',
    titulo: 'TXT',
    descricao: 'Texto tabulado',
    icone: 'mdi-file-document-outline',
  },
  {
    formato: 'pdf',
    titulo: 'PDF',
    descricao: 'Documento para leitura',
    icone: 'mdi-file-pdf-box',
  },
  {
    formato: 'excel',
    titulo: 'Excel',
    descricao: 'Planilha .xlsx',
    icone: 'mdi-file-excel-outline',
  },
];

// Composables
const { exportando, exportarDados } = useExportacaoDados();

// Injeções
const manterDrawerAberto = inject<((pValor: boolean) => void) | undefined>('drawerKeepOpen', undefined);

// Reativas
const exibirMenu = ref(false);
const formatoCarregando = ref<TFormatoExportacaoDados | null>(null);

// Computadas
const manterAberto = computed(() => exibirMenu.value);

// Funções
async function handleExportar(pFormato: TFormatoExportacaoDados): Promise<void> {
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
