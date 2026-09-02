<template>
  <v-menu
    :openOnClick="false"
    openOnHover
  >
    <template #activator="{ props: menuProps }">
      <slot
        :aplicar="executarAcaoPadrao"
        :props="menuProps"
      >
        <v-chip
          v-bind="menuProps"
          :prependIcon="icone"
          color="primary"
          variant="tonal"
          @click.stop="executarAcaoPadrao"
        >
          {{ rotulo }}
        </v-chip>
      </slot>
    </template>

    <v-list density="compact">
      <v-list-item
        prependIcon="mdi-filter-check"
        title="Aplicar"
        @click="executar('aplicar')"
      />
      <v-list-item
        prependIcon="mdi-filter-plus"
        title="Adicionar"
        @click="executar('adicionar')"
      />
      <v-list-item
        prependIcon="mdi-filter-remove"
        title="Sobreescrever"
        @click="executar('sobreescrever')"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';

type TAcaoOpcaoFiltro = 'adicionar' | 'aplicar' | 'sobreescrever';

/**
 * @property {TFiltroConsultaSerializado[]} filtros - Filtros que serão processados pela ação.
 * @property {TAcaoOpcaoFiltro} acaoPadrao - Ação executada pelo clique rápido.
 * @property {string} icone - Ícone exibido pelo ativador padrão.
 * @property {string} rotulo - Texto exibido pelo ativador padrão.
 */
type TProps = {
  filtros: TFiltroConsultaSerializado[];
  acaoPadrao?: TAcaoOpcaoFiltro;
  icone?: string;
  rotulo: string;
};
const props = withDefaults(defineProps<TProps>(), {
  acaoPadrao: 'aplicar',
  icone: 'mdi-filter-outline',
});

type TEmits = {
  executar: [acao: TAcaoOpcaoFiltro];
};
const emits = defineEmits<TEmits>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Funções
function clonarFiltros(): TFiltroConsultaSerializado[] {
  return props.filtros.map((pFiltro) => ({ ...pFiltro, valoresSelecionados: [...(pFiltro.valoresSelecionados ?? [])] }));
}

function executar(pAcao: TAcaoOpcaoFiltro): void {
  const filtros = clonarFiltros();

  if (pAcao === 'sobreescrever') {
    genericFilterStore.filtersApplied = filtros;
  } else {
    genericFilterStore.filtersApplied = [...genericFilterStore.filtersApplied, ...filtros];
  }

  if (pAcao !== 'adicionar') {
    genericFilterStore.confirmarAplicacaoFiltros();
  }

  emits('executar', pAcao);
}

function executarAcaoPadrao(): void {
  executar(props.acaoPadrao);
}

defineExpose({ executar } as const);
</script>
