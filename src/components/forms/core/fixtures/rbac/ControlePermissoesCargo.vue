<template>
  <div class="d-flex flex-column ga-4">
    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
      <div>
        <div class="text-subtitle-1 font-weight-bold">
          {{ t('forms.controlePermissoesCargo.rotas.titulo') }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{ t('forms.controlePermissoesCargo.rotas.subtitulo') }}
        </div>
      </div>

      <v-chip
        :color="padraoLiberado ? 'success' : 'error'"
        :prependIcon="padraoLiberado ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
        size="small"
        variant="tonal"
      >
        {{
          padraoLiberado
            ? t('forms.controlePermissoesCargo.comportamentoPadrao.liberar')
            : t('forms.controlePermissoesCargo.comportamentoPadrao.bloquear')
        }}
      </v-chip>
    </div>

    <div class="d-flex justify-end pr-2 text-caption text-medium-emphasis">
      {{ t('forms.controlePermissoesCargo.rotas.colunaAcoes') }}
    </div>

    <v-list
      class="pa-0 border rounded"
      density="compact"
    >
      <v-list-item
        v-for="rota in rotasPermissao"
        :key="rota.chave"
        :style="{ paddingLeft: `${16 + rota.nivel * 24}px` }"
        class="py-1"
      >
        <template #prepend>
          <v-checkbox-btn
            :modelValue="isRotaCheckboxSelecionado(rota)"
            :color="padraoLiberado ? 'error' : 'success'"
            :disabled="somenteLeitura"
            density="compact"
            @update:modelValue="alternarPermissaoRota(rota, Boolean($event))"
          />
        </template>

        <template #title>
          <div class="d-flex flex-column flex-md-row align-md-center ga-2 w-100">
            <div class="d-flex align-center ga-2 flex-grow-1">
              <v-icon
                :icon="rota.icone"
                size="small"
              />
              <div>
                <div>{{ rota.titulo }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ rota.chave }}
                </div>
              </div>
            </div>

            <div class="d-flex align-center justify-end ga-1 flex-shrink-0">
              <template v-if="rota.recursoApi">
                <v-tooltip
                  v-for="acaoApi in ACOES_API_RBAC"
                  :key="acaoApi"
                  :text="obterDescricaoAcaoApi(acaoApi)"
                  location="top"
                >
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="tooltipProps"
                      :class="{ 'acao-indisponivel': !acaoApiDisponivel(rota, acaoApi) }"
                      :aria-label="obterDescricaoAcaoApi(acaoApi)"
                      :color="
                        isAcaoApiCheckboxSelecionado(rota, acaoApi) ? (padraoLiberado ? 'error' : 'success') : undefined
                      "
                      :disabled="somenteLeitura || isAcaoApiDesabilitada(rota, acaoApi)"
                      :text="obterSiglaAcaoApi(acaoApi)"
                      :variant="isAcaoApiCheckboxSelecionado(rota, acaoApi) ? 'flat' : 'tonal'"
                      minWidth="32"
                      size="x-small"
                      @click.stop="alternarPermissaoAcaoRota(rota, acaoApi)"
                    />
                  </template>
                </v-tooltip>
              </template>

              <span
                v-else
                class="text-caption text-disabled px-2"
              >
                {{ t('forms.controlePermissoesCargo.rotas.semAcoes') }}
              </span>
            </div>
          </div>
        </template>
      </v-list-item>
    </v-list>

    <v-divider />

    <div>
      <div class="text-subtitle-1 font-weight-bold">
        {{ t('forms.controlePermissoesCargo.funcionalidades.titulo') }}
      </div>
      <div class="text-caption text-medium-emphasis">
        {{ t('forms.controlePermissoesCargo.funcionalidades.subtitulo') }}
      </div>
    </div>

    <v-list
      class="pa-0 border rounded"
      density="compact"
    >
      <v-list-item
        v-for="funcionalidade in FUNCIONALIDADES_RBAC"
        :key="funcionalidade.valor"
      >
        <template #prepend>
          <v-checkbox-btn
            :disabled="somenteLeitura"
            :modelValue="funcionalidadeLiberada(funcionalidade.valor)"
            color="success"
            density="compact"
            @update:modelValue="alternarFuncionalidade(funcionalidade.valor, Boolean($event))"
          />
        </template>

        <template #title>
          <div class="d-flex align-center ga-2">
            <v-icon
              :icon="funcionalidade.icone"
              size="small"
            />
            <span>{{ funcionalidade.descricao }}</span>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Mapeamentos
import { FUNCIONALIDADES_RBAC } from '@/models/model/core/rbac/rbac.api';
import {
  ACOES_API_RBAC,
  type IFuncionalidadeCargoRbac,
  type IPermissaoCargoRbac,
  type TAcaoApiRbac,
  type TComportamentoPadraoPermissao,
} from '@/models/model/core/rbac/rbac.types';
// Types e Interfaces
import type {
  IItemPermissaoRota,
} from '@/composables/useControlePermissoesCargo';

// Composables
import { useControlePermissoesCargo } from '@/composables/useControlePermissoesCargo';

/**
 * @property {TComportamentoPadraoPermissao} comportamentoPadrao Regra aplicada quando uma permissão ainda não foi configurada explicitamente.
 * @property {boolean} somenteLeitura Desabilita alteração das permissões.
 */
type TProps = {
  comportamentoPadrao: TComportamentoPadraoPermissao;
  somenteLeitura?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  somenteLeitura: false,
});

// Reativas
const permissoes = defineModel<IPermissaoCargoRbac[]>('permissoes', { required: true });
const funcionalidades = defineModel<IFuncionalidadeCargoRbac[]>('funcionalidades', { required: true });

// Composables
const { t } = useI18n();
const {
  rotasPermissao,
  permissaoRotaLiberada,
  acaoApiDisponivel,
  acaoApiLiberada,
  isAcaoApiDesabilitada,
  obterDescricaoAcaoApi,
  obterSiglaAcaoApi,
   atualizarPermissaoRota,
  atualizarPermissaoAcaoRota,
} = useControlePermissoesCargo(
  permissoes,
  computed(() => props.comportamentoPadrao),
);

// Computadas
const padraoLiberado = computed(() => props.comportamentoPadrao === 'liberar');

// Funções de Alternância Visual/Lógica para Checkboxes

function isRotaCheckboxSelecionado(pRota: IItemPermissaoRota): boolean {
  return padraoLiberado.value ? !permissaoRotaLiberada(pRota) : permissaoRotaLiberada(pRota);
}

function alternarPermissaoRota(pRota: IItemPermissaoRota, pMarcado: boolean): void {
  atualizarPermissaoRota(pRota, padraoLiberado.value ? !pMarcado : pMarcado);
}

function isAcaoApiCheckboxSelecionado(pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac): boolean {
  if (!acaoApiDisponivel(pRota, pAcao)) {
    return false;
  }
  return padraoLiberado.value ? !acaoApiLiberada(pRota, pAcao) : acaoApiLiberada(pRota, pAcao);
}

function alternarPermissaoAcaoRota(pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac): void {
  atualizarPermissaoAcaoRota(pRota, pAcao, !acaoApiLiberada(pRota, pAcao));
}

function funcionalidadeLiberada(pFuncionalidade: string): boolean {
  return funcionalidades.value.find((pItem) => pItem.funcionalidade === pFuncionalidade)?.liberado ?? false;
}

function alternarFuncionalidade(pFuncionalidade: string, pLiberado: boolean): void {
  const funcionalidadesAtualizadas = funcionalidades.value.filter(
    (pItem) => pItem.funcionalidade !== pFuncionalidade,
  );
  funcionalidades.value = [...funcionalidadesAtualizadas, { funcionalidade: pFuncionalidade, liberado: pLiberado }];
}
</script>

<style src="./ControlePermissoesCargo.scss" scoped lang="scss"></style>
