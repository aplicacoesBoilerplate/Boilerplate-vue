<template>
  <v-card
    class="border rounded-lg"
    variant="flat"
  >
    <v-card-text>
      <div class="d-flex align-center ga-2 mb-3">
        <v-icon
          color="primary"
          icon="mdi-routes"
        />
        <span class="text-subtitle-2 font-weight-bold">
          {{ t('forms.configuracaoRedirecionamentoCargo.titulo') }}
        </span>
      </div>

      <v-autocomplete
        :modelValue="redirecionamento.path"
        :items="rotasDisponiveis"
        :label="t('forms.configuracaoRedirecionamentoCargo.inputRota.label')"
        :disabled="somenteLeitura"
        itemTitle="titulo"
        itemValue="path"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        clearable
        @update:modelValue="atualizarRotaInicial"
      >
        <template #selection="{ item }">
          <div class="d-flex align-center ga-2">
            <v-icon
              :icon="item.raw.icone"
              size="small"
            />
            <span>{{ item.raw.titulo }}</span>
          </div>
        </template>

        <template #item="{ props: itemProps, item }">
          <v-list-item
            v-bind="itemProps"
            :title="item.raw.titulo"
            :subtitle="`${item.raw.name} • ${item.raw.path}`"
            :prependIcon="item.raw.icone"
          />
        </template>

        <template
          v-if="deveMontarDialogFiltros && !somenteLeitura"
          #append
        >
          <DialogFiltro
            v-model:exibirFiltros="exibirDialogFiltros"
            :camposDisponiveis="rotaSelecionada?.camposFiltro ?? []"
            :contextoLocal="`redirecionamento-${rotaSelecionada?.name ?? 'rota'}`"
            :filtrosIniciais="redirecionamento.filtros"
            modoLocal
            @onAplicarFiltros="atualizarFiltrosIniciais"
          >
            <template #activator="{ props: dialogProps }">
              <v-tooltip
                v-if="rotaSelecionada?.possuiFiltros"
                :text="t('forms.configuracaoRedirecionamentoCargo.tooltipFiltros')"
                location="bottom"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="mergeProps(tooltipProps, dialogProps)"
                    color="primary"
                    variant="text"
                    size="small"
                    icon
                  >
                    <v-badge
                      :modelValue="redirecionamento.filtros.length > 0"
                      :content="redirecionamento.filtros.length"
                      color="indigo-darken-4"
                    >
                      <v-icon icon="mdi-filter-cog-outline" />
                    </v-badge>
                  </v-btn>
                </template>
              </v-tooltip>
            </template>
          </DialogFiltro>
        </template>
      </v-autocomplete>

      <v-alert
        v-if="redirecionamento.path && !rotaSelecionada?.possuiFiltros"
        class="mt-2"
        type="info"
        variant="tonal"
        density="compact"
      >
        {{ t('forms.configuracaoRedirecionamentoCargo.rotaSemFiltros') }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps, ref } from 'vue';
import { type RouteRecordRaw, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Models
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';
import type { TCampoFiltroMapeado } from '@/models/filters/MapeamentoFiltros';
import type { IRedirecionamentoInicialRbac } from '@/models/model/core/rbac/rbac.types';

// Componentes
import DialogFiltro from '@/components/dialogs/core/filtros/DialogFiltro.vue';

/**
 * @property {TCampoFiltroMapeado[]} camposFiltro - União dos campos de filtro aceitos pela rota selecionada.
 * @property {string} icone - Ícone cadastrado no meta da rota.
 * @property {string} name - Nome técnico usado pelo Vue Router.
 * @property {string} path - Caminho absoluto usado no redirecionamento.
 * @property {boolean} possuiFiltros - Indica se a rota permite montar filtros iniciais.
 * @property {string} titulo - Texto amigável exibido no autocomplete.
 */
type TRotaRedirecionamentoRbac = {
  camposFiltro: TCampoFiltroMapeado[];
  icone: string;
  name: string;
  path: string;
  possuiFiltros: boolean;
  titulo: string;
};

// Composables
const router = useRouter();
const { t } = useI18n();

type TProps = {
  somenteLeitura?: boolean;
};
withDefaults(defineProps<TProps>(), {
  somenteLeitura: false,
});

// Reativas - Model
const redirecionamento = defineModel<IRedirecionamentoInicialRbac>('redirecionamento', { required: true });

// Reativas - ref
const exibirDialogFiltros = ref(false);

// Funções
function atualizarFiltrosIniciais(pFiltros: TFiltroConsultaSerializado[]): void {
  redirecionamento.value = {
    ...redirecionamento.value,
    filtros: pFiltros,
  };
}

function atualizarRotaInicial(pPath: unknown): void {
  const pathAtual = redirecionamento.value.path;
  const rota = rotasDisponiveis.value.find((pRota) => pRota.path === String(pPath ?? ''));

  redirecionamento.value = {
    path: rota?.path ?? '',
    name: rota?.name,
    filtros: rota?.path === pathAtual ? redirecionamento.value.filtros : [],
  };
}

function mapearRotasRedirecionamento(pRotas: readonly RouteRecordRaw[], pCaminhoPai = ''): TRotaRedirecionamentoRbac[] {
  return pRotas.flatMap((pRota) => {
    const path = resolverPathRota(pCaminhoPai, pRota.path);
    const rotasFilhas = mapearRotasRedirecionamento(pRota.children ?? [], path);

    if (pRota.meta?.hidden || !pRota.name) {
      return rotasFilhas;
    }

    const camposFiltro = (pRota.meta?.filterResource as TCampoFiltroMapeado[] | undefined) ?? [];

    return [
      {
        camposFiltro,
        icone: String(pRota.meta?.icon ?? 'mdi-routes'),
        name: String(pRota.name),
        path,
        possuiFiltros: camposFiltro.length > 0,
        titulo: pRota.meta?.title ? t(String(pRota.meta.title)) : String(pRota.name),
      },
      ...rotasFilhas,
    ];
  });
}

function resolverPathRota(pCaminhoPai: string, pPath: string): string {
  if (pPath.startsWith('/')) {
    return pPath;
  }

  const caminhoPaiNormalizado = pCaminhoPai === '/' ? '' : pCaminhoPai;
  const caminhoNormalizado = pPath ? `/${pPath}` : '';

  return `${caminhoPaiNormalizado}${caminhoNormalizado}` || '/';
}

// Computadas
const rotasDisponiveis = computed<TRotaRedirecionamentoRbac[]>(() =>
  mapearRotasRedirecionamento(router.options.routes),
);

const rotaSelecionada = computed(() => {
  return rotasDisponiveis.value.find((pRota) => pRota.path === redirecionamento.value.path);
});

const deveMontarDialogFiltros = computed(() => !!rotaSelecionada.value?.possuiFiltros);
</script>
