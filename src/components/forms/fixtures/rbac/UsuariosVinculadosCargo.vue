<template>
  <ConsultaVinculosFormulario
    :contexto="contextoConsultaUsuarios"
    :buscarRegistros="buscarUsuarios"
    titulo="Usuários vinculados"
    subtitulo="Altere o cargo de um usuário diretamente por este facilitador."
    rotuloPesquisa="Pesquisar usuários"
    iconePesquisa="mdi-account-search-outline"
    textoVazio="Nenhum usuário está vinculado a este cargo."
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
                Alteração pendente
              </v-chip>
            </div>
          </v-list-item-subtitle>

          <template #append>
            <v-select
              :model-value="obterPapelUsuario(usuario)"
              :items="itensCargos"
              itemTitle="nome"
              itemValue="papel"
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
    </template>
  </ConsultaVinculosFormulario>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref, watch } from 'vue';

// Types e Interfaces
import type { ICargoRbac } from '@/models/model/rbac/ICargoRbac';
import type { IUsuario, TPapel } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Componentes
import ConsultaVinculosFormulario from '@/components/forms/fixtures/vinculos/ConsultaVinculosFormulario.vue';

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
const chavesUsuariosAlterados = ref(new Set<string>());
const papeisOriginaisUsuarios = ref(new Map<string, TPapel>());

// Funções
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

function usuarioComAlteracaoPendente(pUsuario: IUsuario): boolean {
  return chavesUsuariosAlterados.value.has(obterChaveUsuario(pUsuario));
}

function obterPapelUsuario(pUsuario: IUsuario): TPapel {
  return usuarios.value.find((pUsuarioAtual) => obterChaveUsuario(pUsuarioAtual) === obterChaveUsuario(pUsuario))?.papel
    ?? pUsuario.papel;
}

function obterChaveUsuario(pUsuario: IUsuario): string {
  return String(pUsuario.id ?? pUsuario.email);
}

function normalizarTexto(pValor: unknown): string {
  return String(pValor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function inicializarPapeisOriginaisUsuarios(): void {
  papeisOriginaisUsuarios.value = new Map(
    usuarios.value.map((pUsuario) => [obterChaveUsuario(pUsuario), pUsuario.papel]),
  );
}

// Computadas
const contextoConsultaUsuarios = computed(() => `usuarios-vinculados-cargo:${props.cargo.papel}`);

const itensCargos = computed(() => {
  return props.cargos
    .filter((pCargo) => pCargo.ativo)
    .map((pCargo) => ({
      papel: pCargo.papel,
      nome: pCargo.nome,
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
