<template>
  <div class="d-flex flex-column ga-3">
    <div>
      <div class="text-subtitle-1 font-weight-bold">Usuários vinculados</div>
      <div class="text-caption text-medium-emphasis">
        Altere o cargo de um usuário diretamente por este facilitador.
      </div>
    </div>

    <v-list
      v-if="usuariosDoCargo.length"
      class="pa-0"
      density="compact"
    >
      <v-list-item
        v-for="usuario in usuariosDoCargo"
        :key="usuario.id ?? usuario.email"
        class="px-0"
      >
        <template #prepend>
          <v-avatar
            color="primary"
            size="34"
          >
            {{ usuario.nome.charAt(0).toUpperCase() }}
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">
          {{ usuario.nome }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ usuario.email }}
        </v-list-item-subtitle>

        <template #append>
          <v-select
            :model-value="usuario.papel"
            :items="itensCargos"
            itemTitle="nome"
            itemValue="codigo"
            maxWidth="180"
            minWidth="160"
            variant="outlined"
            density="compact"
            hideDetails
            @update:model-value="atualizarCargoUsuario(usuario, String($event))"
          />
        </template>
      </v-list-item>
    </v-list>

    <div
      v-else
      class="d-flex flex-column align-center justify-center text-center text-medium-emphasis py-8"
    >
      <v-icon
        icon="mdi-account-off-outline"
        size="40"
        class="mb-2"
      />
      <span>Nenhum usuário está vinculado a este cargo.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';

// Types e Interfaces
import type { ICargoRbac } from '@/models/model/rbac/rbac.models';
import type { IUsuario, TPapel } from '@/models/model/usuario/lUsuario';

type TProps = {
  /**
   * Cargo atualmente editado.
   */
  cargo: ICargoRbac;

  /**
   * Cargos disponíveis para vínculo.
   */
  cargos: ICargoRbac[];
};
const props = defineProps<TProps>();

// Reativas
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });

// Funções
function atualizarCargoUsuario(pUsuario: IUsuario, pCodigoCargo: string): void {
  usuarios.value = usuarios.value.map((pUsuarioAtual) => {
    if ((pUsuarioAtual.id ?? pUsuarioAtual.email) !== (pUsuario.id ?? pUsuario.email)) {
      return pUsuarioAtual;
    }

    return {
      ...pUsuarioAtual,
      papel: pCodigoCargo as TPapel,
    };
  });
}

// Computadas
const usuariosDoCargo = computed(() => usuarios.value.filter((pUsuario) => pUsuario.papel === props.cargo.codigo));

const itensCargos = computed(() => {
  return props.cargos
    .filter((pCargo) => pCargo.ativo)
    .map((pCargo) => ({
      codigo: pCargo.codigo,
      nome: pCargo.nome,
    }));
});

</script>
