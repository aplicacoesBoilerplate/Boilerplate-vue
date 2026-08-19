<template>
  <BaseDetalhesCargo
    :titulo="cargo.nome"
    :subtitulo="cargo.papel"
  >
    <template #activator="{ props: menuProps }">
      <v-tooltip :text="t('components.detalhesCargo.tooltip')">
        <template #activator="{ props: tooltipProps }">
          <v-chip
            v-bind="mergeProps(menuProps, tooltipProps)"
            link
            pill
          >
            <v-avatar
              :color="cargo.ativo ? 'primary' : 'grey'"
              class="text-white"
              start
            >
              <v-icon :icon="cargo.icone" />
            </v-avatar>

            <v-list-item-title class="font-weight-bold text-primary">
              {{ cargo.nome }}
            </v-list-item-title>
          </v-chip>
        </template>
      </v-tooltip>
    </template>

    <template #avatar-prepend-card>
      <v-avatar
        :color="cargo.ativo ? 'primary' : 'grey'"
        class="text-white">
        <v-icon :icon="cargo.icone" />
      </v-avatar>
    </template>

    <template #content="{ fechar }">
      <v-card-text>
        <v-list-item-subtitle>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              :color="cargo.comportamentoPadrao === 'liberar' ? 'green-accent-3' : 'red-lighten-1'"
              :prependIcon="cargo.comportamentoPadrao === 'liberar' ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
              size="small"
              variant="tonal"
            >
              {{
                cargo.comportamentoPadrao === 'liberar'
                  ? t('forms.controlePermissoesCargo.comportamentoPadrao.liberar')
                  : t('forms.controlePermissoesCargo.comportamentoPadrao.bloquear')
              }}
            </v-chip>

            <v-chip
              color="info"
              prependIcon="mdi-shield-check-outline"
              size="small"
              variant="tonal"
            >
              {{ t('components.detalhesCargo.liberacoes', { quantidade: quantidadePermissoesLiberadas }) }}
            </v-chip>

            <v-chip
              color="cyan-accent-2"
              prependIcon="mdi-account-group-outline"
              size="small"
              variant="tonal"
            >
              {{ t('components.detalhesCargo.usuarios', { quantidade: quantidadeUsuariosVinculados }) }}
            </v-chip>
          </div>
        </v-list-item-subtitle>

        <v-list-item-subtitle class="mt-2">
          {{ cargo.descricao || t('components.detalhesCargo.semDescricao') }}
        </v-list-item-subtitle>

        <div class="d-flex justify-end mt-3">
          <v-btn
            :text="t('common.actions.openDetails')"
            color="primary"
            prependIcon="mdi-eye-outline"
            size="small"
            variant="tonal"
            @click="abrirVisualizacao(fechar)"
          />
        </div>
      </v-card-text>
    </template>
  </BaseDetalhesCargo>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { mergeProps } from 'vue';
import { useI18n } from 'vue-i18n';

// Models
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model.ts';

// Componentes
import BaseDetalhesCargo from './BaseDetalhesCargo.vue';

/**
 * @description Propriedades do componente de Detalhes do Cargo RBAC.
 * @property {ICargoRbac} cargo - Cargo exibido no item da lista.
 * @property {number} quantidadePermissoesLiberadas - Quantidade de permissões liberadas para o cargo.
 * @property {number} quantidadeUsuariosVinculados - Quantidade de usuários vinculados ao cargo.
 */
type TProps = {
  cargo: ICargoRbac;
  quantidadePermissoesLiberadas: number;
  quantidadeUsuariosVinculados: number;
};
const props = defineProps<TProps>();

type TEmits = {
  visualizar: [cargo: ICargoRbac];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();

// Funções
function abrirVisualizacao(pFechar: () => void): void {
  pFechar();
  emits('visualizar', props.cargo);
}
</script>
