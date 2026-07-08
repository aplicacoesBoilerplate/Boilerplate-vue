<template>
  <ConsultaVinculosFormulario
    :contexto="contextoConsultaUsuarios"
    :buscarRegistros="buscarUsuarios"
    :titulo="t('forms.usuariosVinculadosCargo.titulo')"
    :subtitulo="t('forms.usuariosVinculadosCargo.subtitulo')"
    :rotuloPesquisa="t('forms.usuariosVinculadosCargo.rotuloPesquisa')"
    iconePesquisa="mdi-account-search-outline"
    :textoVazio="t('forms.usuariosVinculadosCargo.textoVazio')"
    iconeVazio="mdi-account-off-outline"
    :limite="10"
    atributoChave="id"
    atributoTitulo="nome"
    atributoSubtitulo="email"
  >
    <template #default="{ items }">
      <v-list
        v-if="items.length"
        class="pa-0"
        density="compact"
      >
        <v-list-item
          v-for="usuario in (items as IUsuario[])"
          :key="obterChaveUsuario(usuario)"
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
            <div class="d-flex flex-wrap align-center ga-2">
              <span>{{ usuario.email }}</span>
              <v-chip
                v-if="usuarioComAlteracaoPendente(usuario)"
                color="warning"
                size="x-small"
                variant="tonal"
              >
                {{ t('forms.usuariosVinculadosCargo.alteracaoPendente') }}
              </v-chip>
            </div>
          </v-list-item-subtitle>

          <template #append>
            <SelectRole
              :model-value="obterPapelUsuario(usuario)"
              :itens="itensCargos"
              :disabled="somenteLeitura"
              hideDetails
              maxWidth="180"
              minWidth="160"
              @update:model-value="atualizarCargoUsuario(usuario, String($event))"
            />
          </template>
        </v-list-item>
      </v-list>
    </template>
  </ConsultaVinculosFormulario>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { ICargoRbac } from '@/models/model/rbac/ICargoRbac';
import type { IUsuario, TPapel } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Componentes
import ConsultaVinculosFormulario from '@/components/forms/fixtures/vinculos/ConsultaVinculosFormulario.vue';
import SelectRole, { type IItemSelectPapel } from '@/components/forms/fixtures/SelectRole.vue';

type TProps = {
  /**
   * Cargo atualmente editado.
   */
  cargo: ICargoRbac;

  /**
   * Cargos disponíveis para vínculo.
   */
  cargos: ICargoRbac[];

  /**
   * Desabilita alterações de vínculo.
   */
  somenteLeitura?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  somenteLeitura: false,
});

// Composables
const { t } = useI18n();

// Reativas
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });
const chavesUsuariosAlterados = ref(new Set<string>());
const papeisOriginaisUsuarios = ref(new Map<string, TPapel>());

// Funções
/**
 * Busca usuários vinculados ao cargo atual ou com alteração pendente no formulário.
 */
async function buscarUsuarios(
  pPayload: IGenericListFetchPayload & { termoPesquisa: string },
): Promise<TGenericListFetchResponse<IUsuario>> {
  const usuariosFiltrados = filtrarUsuariosPorCargoEPesquisa(pPayload.termoPesquisa);
  const inicio = (pPayload.proximaEntrada as number) || 0;
  const limite = pPayload.limite || 10;
  const dados = usuariosFiltrados.slice(inicio, inicio + limite);

  return {
    items: dados,
    temMaisRegistros: inicio + dados.length < usuariosFiltrados.length,
    proximaEntrada: inicio + dados.length < usuariosFiltrados.length ? inicio + dados.length : undefined,
  };
}

/**
 * Atualiza o cargo do usuário em memória e controla se há alteração pendente.
 */
function atualizarCargoUsuario(pUsuario: IUsuario, pPapelCargo: string): void {
  const chaveUsuario = obterChaveUsuario(pUsuario);
  const papelOriginal = papeisOriginaisUsuarios.value.get(chaveUsuario) ?? pUsuario.papel;

  if (papelOriginal === pPapelCargo) {
    chavesUsuariosAlterados.value.delete(chaveUsuario);
  } else {
    chavesUsuariosAlterados.value.add(chaveUsuario);
  }

  usuarios.value = usuarios.value.map((pUsuarioAtual) => {
    if (obterChaveUsuario(pUsuarioAtual) !== chaveUsuario) {
      return pUsuarioAtual;
    }

    return {
      ...pUsuarioAtual,
      papel: pPapelCargo as TPapel,
    };
  });
}

/**
 * Filtra usuários pelo cargo aberto no formulário, mantendo os registros alterados até o submit.
 */
function filtrarUsuariosPorCargoEPesquisa(pTermoPesquisa: string): IUsuario[] {
  const termoPesquisa = normalizarTexto(pTermoPesquisa);

  return usuarios.value.filter((pUsuario) => {
    const usuarioPertenceAoCargo = pUsuario.papel === props.cargo.papel;
    const usuarioPossuiAlteracaoPendente = usuarioComAlteracaoPendente(pUsuario);

    if (!usuarioPertenceAoCargo && !usuarioPossuiAlteracaoPendente) {
      return false;
    }

    if (!termoPesquisa) {
      return true;
    }

    return [
      pUsuario.nome,
      pUsuario.email,
      pUsuario.papel,
    ].some((pValor) => normalizarTexto(pValor).includes(termoPesquisa));
  });
}

/**
 * Indica se o usuário possui alteração de cargo ainda não salva.
 */
function usuarioComAlteracaoPendente(pUsuario: IUsuario): boolean {
  return chavesUsuariosAlterados.value.has(obterChaveUsuario(pUsuario));
}

/**
 * Resolve o papel atual do usuário a partir do model editável do formulário.
 */
function obterPapelUsuario(pUsuario: IUsuario): TPapel {
  return usuarios.value.find((pUsuarioAtual) => obterChaveUsuario(pUsuarioAtual) === obterChaveUsuario(pUsuario))?.papel
    ?? pUsuario.papel;
}

/**
 * Usa o id quando disponível e o e-mail como fallback estável para usuários mockados.
 */
function obterChaveUsuario(pUsuario: IUsuario): string {
  return String(pUsuario.id ?? pUsuario.email);
}

/**
 * Normaliza valores textuais para comparação simples na busca local.
 */
function normalizarTexto(pValor: unknown): string {
  return String(pValor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

/**
 * Captura o papel original dos usuários para detectar quando uma alteração foi desfeita.
 */
function inicializarPapeisOriginaisUsuarios(): void {
  papeisOriginaisUsuarios.value = new Map(
    usuarios.value.map((pUsuario) => [obterChaveUsuario(pUsuario), pUsuario.papel]),
  );
}

// Computadas
const contextoConsultaUsuarios = computed(() => `usuarios-vinculados-cargo:${props.cargo.papel}`);

const itensCargos = computed<IItemSelectPapel[]>(() => {
  return props.cargos
    .filter((pCargo) => pCargo.ativo)
    .map((pCargo) => ({
      valor: pCargo.papel,
      label: pCargo.nome,
      icone: pCargo.icone,
    }));
});

// Observadores
watch(
  () => props.cargo.papel,
  () => {
    chavesUsuariosAlterados.value = new Set();
    inicializarPapeisOriginaisUsuarios();
  },
  { immediate: true },
);
</script>
