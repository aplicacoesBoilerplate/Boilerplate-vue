<template>
  <BaseDialog
    v-model:exibirDialog="exibirDialog"
    :maxWidth="980"
    :titulo="titulo"
    :iconePrependTitulo="icone"
  >
    <template #activator="{ props }">
      <slot
        name="activator"
        :props="props"
      >
        <v-btn
          v-bind="props"
          color="primary"
          icon="mdi-plus"
          size="x-small"
        />
      </slot>
    </template>

    <template #content>
      <FormCargoRbac
        ref="refFormCargo"
        v-model:cargo="cargo"
        v-model:usuarios="usuarios"
        v-model:valido="formValido"
        :cargosDisponiveis="cargosDisponiveis"
      />
    </template>

    <template #actions>
      <v-btn
        v-tooltip="'Limpar'"
        color="amber"
        prepend-icon="mdi-refresh"
        text="Limpar"
        variant="text"
        @click="resetarFormCargo"
      />

      <v-spacer />

      <v-btn
        v-tooltip="'Salvar'"
        :disabled="!formValido"
        color="success"
        prepend-icon="mdi-content-save"
        text="Salvar"
        variant="flat"
        @click="salvarCargo"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';

// Types e Interfaces
import { criarCargoRbacPadrao, type ICargoRbac } from '@/models/model/rbac/rbac.models';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Componentes
import BaseDialog from './base/BaseDialog.vue';
import FormCargoRbac from '@/components/forms/FormCargoRbac.vue';

type TProps = {
  /**
   * Define se o diálogo está criando ou editando um cargo.
   */
  modoEdicao: boolean;

  /**
   * Cargos disponíveis para vínculo de usuários.
   */
  cargosDisponiveis: ICargoRbac[];
};

// Props
const props = defineProps<TProps>();

type TEmits = {
  salvar: [];
};

// Emits
const emit = defineEmits<TEmits>();

// Reativas - Model
const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const cargo = defineModel<ICargoRbac>('cargo', { required: false, default: {} });
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });

// Reativas - Ref
const refFormCargo = ref<InstanceType<typeof FormCargoRbac> | null>(null);
const formValido = ref(false);

// Computadas
const titulo = computed(() => (props.modoEdicao ? `Editar cargo ${cargo.value.nome}` : 'Criar novo cargo'));
const icone = computed(() => (props.modoEdicao ? 'mdi-shield-edit-outline' : 'mdi-shield-plus-outline'));

// Funções
function resetarFormCargo(): void {
  refFormCargo.value?.reset();
  cargo.value = criarCargoRbacPadrao();
}

function salvarCargo(): void {
  emit('salvar');
  exibirDialog.value = false;
}
</script>
