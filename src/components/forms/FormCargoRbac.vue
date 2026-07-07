<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emits('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-window
      v-model="abaAtual"
      class="pt-4"
    >
      <v-window-item value="dados">
        <v-row density="comfortable">
          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <v-text-field
              :model-value="cargo.nome"
              :counter="60"
              :rules="[rules.required(), rules.maxLength(60)]"
              :label="t('forms.formCargoRbac.inputNome.label')"
              variant="outlined"
              density="compact"
              autocomplete="off"
              @update:model-value="atualizarNomeCargo"
            />
          </v-col>

          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <v-text-field
              :model-value="cargo.papel"
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
            />
          </v-col>

          <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
            <v-select
              v-model="cargo.comportamentoPadrao"
              :items="itensComportamentoPadrao"
              itemTitle="descricao"
              itemValue="valor"
              :label="t('forms.formCargoRbac.inputComportamentoPadrao.label')"
              variant="outlined"
              density="compact"
              autocomplete="off"
            >
              <template #selection="{ item }">
                <div class="d-flex align-center ga-2">
                  <v-icon
                    :color="item.raw.cor"
                    :icon="item.raw.icone"
                    size="small"
                  />
                  <span>{{ item.raw.descricao }}</span>
                </div>
              </template>

              <template #item="{ props: itemProps, item }">
                <v-list-item
                  v-bind="itemProps"
                  :prependIcon="item.raw.icone"
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
              rows="2"
              variant="outlined"
              density="compact"
              autocomplete="off"
              autoGrow
            />
          </v-col>

          <v-col cols="12">
            <ConfiguracaoRedirecionamentoCargo v-model:redirecionamento="redirecionamentoInicialCargo" />
          </v-col>

          <v-col cols="12">
            <v-checkbox
              v-model="cargo.ativo"
              class="pa-0"
              :label="t('forms.formCargoRbac.inputAtivo.label')"
              color="success"
              hideDetails
            />
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="permissoes">
        <ControlePermissoesCargo
          v-model:permissoes="cargo.permissoes"
          :comportamentoPadrao="cargo.comportamentoPadrao"
        />
      </v-window-item>

      <v-window-item value="usuarios">
        <UsuariosVinculadosCargo
          v-model:usuarios="usuarios"
          :cargo="cargo"
          :cargos="cargosDisponiveis"
        />
      </v-window-item>
    </v-window>
  </BaseForm>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import type { ICargoRbac, IRedirecionamentoInicialRbac } from '@/models/model/rbac/ICargoRbac';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Mapeamentos
import { COMPORTAMENTOS_PADRAO_PERMISSAO, criarCargoRbacPadrao, normalizarPapelCargo } from '@/models/model/rbac/ICargoRbac';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';
import ConfiguracaoRedirecionamentoCargo from '@/components/forms/fixtures/rbac/ConfiguracaoRedirecionamentoCargo.vue';
import ControlePermissoesCargo from '@/components/forms/fixtures/rbac/ControlePermissoesCargo.vue';
import SeletorIconeMaterialDesign from '@/components/forms/fixtures/SeletorIconeMaterialDesign.vue';
import UsuariosVinculadosCargo from '@/components/forms/fixtures/rbac/UsuariosVinculadosCargo.vue';

/**
 * @property {ICargoRbac[]} cargosDisponiveis - Cargos disponíveis para vínculo de usuários.
 */
type TProps = {
  cargosDisponiveis: ICargoRbac[];
};
defineProps<TProps>();

type TEmits = {
  onSubmit: [];
};
const emits = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const formIsValid = defineModel<boolean>('valido', { default: false });
const cargo = defineModel<ICargoRbac>('cargo', { required: true });
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });
const abaAtual = defineModel<string>('abaAtual', { required: true, default: 'dados' });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);

// Funções
function atualizarNomeCargo(pValor: unknown): void {
  const nome = String(pValor ?? '');

  cargo.value.nome = nome;
  cargo.value.papel = normalizarPapelCargo(nome);
}

// Computadas
const redirecionamentoInicialCargo = computed<IRedirecionamentoInicialRbac>({
  get: () => cargo.value.redirecionamentoInicial ?? criarCargoRbacPadrao(cargo.value).redirecionamentoInicial,
  set: (pRedirecionamento) => {
    cargo.value = criarCargoRbacPadrao({
      ...cargo.value,
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

// Expose
defineExpose({
  resetar: () => baseFormRef.value?.resetValidation(),
  submeter: () => baseFormRef.value?.submit(),
  reset: () => baseFormRef.value?.resetValidation(),
  submit: () => baseFormRef.value?.submit(),
});
</script>
