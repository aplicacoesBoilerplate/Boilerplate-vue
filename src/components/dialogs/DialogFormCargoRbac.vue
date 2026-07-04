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
        @onSubmit="salvarCargo"
      />
    </template>

    <template #actions>
      <v-btn
        v-tooltip="'Limpar'"
        text="Limpar"
        color="amber"
        variant="text"
        prependIcon="mdi-refresh"
        @click="resetarFormCargo"
      />

      <v-spacer />

      <v-btn
        :disabled="!formValido"
        v-tooltip="'Salvar'"
        text="Salvar"
        color="success"
        variant="flat"
        prependIcon="mdi-content-save"
        @click="submeterFormCargo"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';

// Types e Interfaces
import { criarCargoRbacPadrao, type ICargoRbac } from '@/models/model/rbac/ICargoRbac.ts';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Componentes
import BaseDialog from './base/BaseDialog.vue';
import FormCargoRbac from '@/components/forms/FormCargoRbac.vue';

/**
 * @property {boolean} modoEdicao - Define se o diálogo está criando ou editando um cargo.
 * @property {ICargoRbac[]} cargosDisponiveis - Cargos disponíveis para vínculo de usuários.
 */
type TProps = {
  modoEdicao: boolean;
  cargosDisponiveis: ICargoRbac[];
};
const props = defineProps<TProps>();

type TEmits = {
  salvar: [];
};
const emits = defineEmits<TEmits>();

// Reativas - Model
const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const cargo = defineModel<ICargoRbac>('cargo', { required: false, default: {} });
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });

// Reativas - ref
const refFormCargo = ref<InstanceType<typeof FormCargoRbac> | null>(null);
const formValido = ref(false);

// Funções
function resetarFormCargo(): void {
  refFormCargo.value?.reset();
  cargo.value = criarCargoRbacPadrao();
}

function submeterFormCargo(): void {
  refFormCargo.value?.submit();
}

function salvarCargo(): void {
  emits('salvar');
  exibirDialog.value = false;
}

// Computadas
const titulo = computed(() => (props.modoEdicao ? `Editar cargo ${cargo.value.nome}` : 'Criar novo cargo'));
const icone = computed(() => (props.modoEdicao ? 'mdi-shield-edit-outline' : 'mdi-shield-plus-outline'));

</script>
