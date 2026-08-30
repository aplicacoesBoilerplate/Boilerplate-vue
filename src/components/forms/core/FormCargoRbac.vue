<template>
  <BaseForm
    ref="baseFormRef"
    v-model:isDirty="formAlterado"
    :formModel="cargo"
    @onSubmit="emits('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-window
      v-model="abaAtual"
      class="pt-4"
    >
      <v-window-item value="dados">
        <v-row>
          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <v-text-field
              :modelValue="cargo.nome"
              :counter="60"
              :rules="[rules.required(), rules.maxLength(60)]"
              :label="t('forms.formCargoRbac.inputNome.label')"
              :readonly="somenteLeitura"
              :disabled="somenteLeitura"
              variant="outlined"
              density="compact"
              autocomplete="off"
              @update:modelValue="atualizarNomeCargo"
            />
          </v-col>

          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <v-text-field
              :modelValue="cargo.papel"
              :counter="40"
              :rules="[rules.required(), rules.maxLength(40)]"
              :label="t('forms.formCargoRbac.inputPapel.label')"
              :hint="t('forms.formCargoRbac.inputPapel.hint')"
              variant="outlined"
              density="compact"
              autocomplete="off"
              readonly
              disabled
            />
          </v-col>

          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <SeletorIconeMaterialDesign
              v-model="cargo.icone"
              :rules="[rules.maxLength(60)]"
              :disabled="somenteLeitura"
            />
          </v-col>

          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <v-select
              v-model="cargo.comportamentoPadrao"
              :items="itensComportamentoPadrao"
              :label="t('forms.formCargoRbac.inputComportamentoPadrao.label')"
              :disabled="somenteLeitura"
              itemTitle="descricao"
              itemValue="valor"
              variant="outlined"
              density="compact"
              autocomplete="off"
            >
              <template #selection="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-icon
                    :color="item.cor"
                    :icon="item.icone"
                    size="small"
                  />
                  <span>{{ item.descricao }}</span>
                </div>
              </template>

              <template #item="{ props: itemProps, item }">
                <v-list-item
                  v-bind="itemProps"
                  :prependIcon="item.icone"
                />
              </template>
            </v-select>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="cargo.descricao"
              :rules="[rules.maxLength(180)]"
              :counter="180"
              :label="t('forms.formCargoRbac.inputDescricao.label')"
              :readonly="somenteLeitura"
              :disabled="somenteLeitura"
              rows="2"
              variant="outlined"
              density="compact"
              autocomplete="off"
              autoGrow
            />
          </v-col>

          <v-col cols="12">
            <ConfiguracaoRedirecionamentoCargo
              v-model:redirecionamento="redirecionamentoInicialCargo"
              :somenteLeitura="somenteLeitura"
            />
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="cargo.ativo"
              :label="t('forms.formCargoRbac.inputAtivo.label')"
              :disabled="somenteLeitura"
              class="pa-0"
              color="success"
              hideDetails
            />
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="permissoes">
        <ControlePermissoesCargo
          v-model:permissoes="cargo.permissoes"
          v-model:funcionalidades="cargo.funcionalidades"
          :comportamentoPadrao="cargo.comportamentoPadrao"
          :somenteLeitura="somenteLeitura"
        />
      </v-window-item>

      <v-window-item value="usuarios">
        <UsuariosVinculadosCargo
          v-model:usuarios="usuarios"
          :cargo="cargo"
          :cargos="cargosDisponiveis"
          :somenteLeitura="somenteLeitura"
        />
      </v-window-item>
    </v-window>
  </BaseForm>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Models
import {
  COMPORTAMENTOS_PADRAO_PERMISSAO,
  criarCargoRbacPadrao,
  type ICargoRbac
} from '@/models/model/core/rbac/rbac.model';
import type { IRedirecionamentoInicialRbac } from '@/models/model/core/rbac/rbac.types';
import type { IUsuario } from '@/models/model/core/usuario.model';

// Composables
import { useControlePermissoesCargo } from '@/composables/useControlePermissoesCargo';

// Utils
import { deepClone } from '@/utils/deepClone';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';
import ConfiguracaoRedirecionamentoCargo from '@/components/forms/core/fixtures/rbac/ConfiguracaoRedirecionamentoCargo.vue';
import ControlePermissoesCargo from '@/components/forms/core/fixtures/rbac/ControlePermissoesCargo.vue';
import UsuariosVinculadosCargo from '@/components/forms/core/fixtures/rbac/UsuariosVinculadosCargo.vue';
import SeletorIconeMaterialDesign from '@/components/forms/fixtures/SeletorIcone/SeletorIconeMaterialDesign.vue';

// Classes
import { CNormalizadores } from '@/classes/Utils/CNormalizadores';

/**
 * @description Métodos expostos pelo formulário de cargo RBAC.
 * @property {() => Promise<void>} refreshForm - Restaura o estado original do formulário.
 * @property {() => void} registrarModeloInicial - Registra o estado atual como referência para detectar alterações.
 * @property {() => void} submit - Dispara a validação e submit do formulário.
 */
export interface IFormCargoRbacExpose {
  refreshForm: () => Promise<void>;
  registrarModeloInicial: () => void;
  submit: () => void;
}

/**
 * @property {ICargoRbac[]} cargosDisponiveis - Cargos disponíveis para vínculo de usuários.
 * @property {boolean} somenteLeitura - Desabilita alterações no formulário.
 */
type TProps = {
  cargosDisponiveis: ICargoRbac[];
  somenteLeitura?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  somenteLeitura: false,
});

type TEmits = {
  onSubmit: [];
};
const emits = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const formIsValid = defineModel<boolean>('valido', { default: false });
const formAlterado = defineModel<boolean>('alterado', { default: false });
const cargo = defineModel<ICargoRbac>('cargo', { required: true });
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });
const abaAtual = defineModel<string>('abaAtual', { required: true, default: 'dados' });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const cargoOriginal = ref<ICargoRbac>(deepClone(toRaw(cargo.value)));

// Computadas de permissões
const somenteLeitura = computed(() => props.somenteLeitura);

const permissoesCargo = computed({
  get: () => cargo.value.permissoes,
  set: (pValor) => {
    cargo.value.permissoes = pValor;
  },
});

// Composables
const { obterPermissoesComRedirecionamentoInicialLiberado } = useControlePermissoesCargo(
  permissoesCargo,
  computed(() => cargo.value.comportamentoPadrao),
);

// Funções
function atualizarNomeCargo(pValor: unknown): void {
  if (somenteLeitura.value) {
    return;
  }

  const nome = String(pValor ?? '');
  cargo.value.nome = nome;
  cargo.value.papel = CNormalizadores.normalizarPapelCargo(nome);
}

/**
 * @description Sincroniza as permissões com o redirecionamento inicial.
 */
function sincronizarPermissoesRedirecionamentoInicial(): void {
  if (somenteLeitura.value) {
    return;
  }

  const permissoes = obterPermissoesComRedirecionamentoInicialLiberado(
    cargo.value.permissoes,
    redirecionamentoInicialCargo.value,
  );

  if (permissoes === cargo.value.permissoes) {
    return;
  }

  cargo.value = criarCargoRbacPadrao({
    ...cargo.value,
    permissoes,
  });
}

async function refreshForm(): Promise<void> {
  if (!baseFormRef.value) return;
  await baseFormRef.value.refreshForm(() => {
    const lModoEdicao: boolean = cargoOriginal.value.id !== undefined && cargoOriginal.value.id > 0;
    return lModoEdicao ? criarCargoRbacPadrao(cargoOriginal.value) : criarCargoRbacPadrao();
  });
}

function registrarModeloInicial(): void {
  cargoOriginal.value = deepClone(toRaw(cargo.value));
  baseFormRef.value?.registrarModeloInicial();
}

// Computadas
const redirecionamentoInicialCargo = computed<IRedirecionamentoInicialRbac>({
  get: () => cargo.value.redirecionamentoInicial ?? criarCargoRbacPadrao(cargo.value).redirecionamentoInicial,
  set: (pRedirecionamento) => {
    const permissoes = obterPermissoesComRedirecionamentoInicialLiberado(cargo.value.permissoes, pRedirecionamento);

    cargo.value = criarCargoRbacPadrao({
      ...cargo.value,
      permissoes,
      redirecionamentoInicial: pRedirecionamento,
    });
  },
});

const itensComportamentoPadrao = computed(() => {
  return COMPORTAMENTOS_PADRAO_PERMISSAO.map((pComportamento) => ({
    ...pComportamento,
    descricao: t(`forms.formCargoRbac.comportamentosPadrao.${pComportamento.valor}`),
  }));
});

const assinaturaPermissoesCargo = computed(() => {
  return cargo.value.permissoes
    .map((pPermissao) => `${pPermissao.recurso}:${pPermissao.acao}:${pPermissao.liberado}`)
    .join('|');
});

// Observadores
watch(
  [() => redirecionamentoInicialCargo.value.name, assinaturaPermissoesCargo],
  sincronizarPermissoesRedirecionamentoInicial,
  { immediate: true },
);

// Expose
defineExpose({
  refreshForm,
  registrarModeloInicial,
  submit: () => baseFormRef.value?.submit(),
} satisfies IFormCargoRbacExpose);
</script>
