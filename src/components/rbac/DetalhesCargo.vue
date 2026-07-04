<template>
  <BaseDetalhesCargo
    :titulo="cargo.nome"
    :subtitulo="cargo.papel"
  >
    <template #activator="{ props: menuProps }">
      <v-tooltip text="Detalhes">
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
      <v-avatar :color="cargo.ativo ? 'primary' : 'grey'" class="text-white">
        <v-icon :icon="cargo.icone" />
      </v-avatar>
    </template>

    <template #content>
      <v-card-text>
        <v-list-item-subtitle>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              :color="cargo.comportamentoPadrao === 'liberar' ? 'green-accent-3' : 'red-lighten-1'"
              :prependIcon="cargo.comportamentoPadrao === 'liberar' ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
              size="small"
              variant="tonal"
            >
              {{ cargo.comportamentoPadrao === 'liberar' ? 'Libera por padrão' : 'Bloqueia por padrão' }}
            </v-chip>

            <v-chip
              color="info"
              prependIcon="mdi-shield-check-outline"
              size="small"
              variant="tonal"
            >
              {{ quantidadePermissoesLiberadas }} liberações
            </v-chip>

            <v-chip
              color="cyan-accent-2"
              prependIcon="mdi-account-group-outline"
              size="small"
              variant="tonal"
            >
              {{ quantidadeUsuariosVinculados }} usuário(s)
            </v-chip>
          </div>
        </v-list-item-subtitle>

        <v-list-item-subtitle class="mt-2">
          {{ cargo.descricao || 'Sem descrição cadastrada.' }}
        </v-list-item-subtitle>
      </v-card-text>
    </template>
  </BaseDetalhesCargo>
</template>

<script setup lang="ts">
// Types e Interfaces
import type { ICargoRbac } from '@/models/model/rbac/ICargoRbac.ts';

// Componentes
import BaseDetalhesCargo from './BaseDetalhesCargo.vue';
import { mergeProps } from 'vue';

type TProps = {
  /**
   * Cargo exibido no item da lista.
   */
  cargo: ICargoRbac;

  /**
   * Quantidade de permissões liberadas para o cargo.
   */
  quantidadePermissoesLiberadas: number;

  /**
   * Quantidade de usuários vinculados ao cargo.
   */
  quantidadeUsuariosVinculados: number;
};
defineProps<TProps>();
</script>
