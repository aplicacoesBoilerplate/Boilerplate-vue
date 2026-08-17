<template>
  <ConsultaVinculosFormulario
    :contexto="contextoConsultaUsuarios"
    :buscarRegistros="buscarUsuarios"
    :titulo="t('forms.usuariosVinculadosCargo.titulo')"
    :subtitulo="t('forms.usuariosVinculadosCargo.subtitulo')"
    :rotuloPesquisa="t('forms.usuariosVinculadosCargo.rotuloPesquisa')"
    :textoVazio="t('forms.usuariosVinculadosCargo.textoVazio')"
    :limite="10"
    iconePesquisa="mdi-account-search-outline"
    iconeVazio="mdi-account-off-outline"
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
          v-for="usuario in items as IUsuario[]"
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
            <div class="d-flex align-center ga-2">
              <v-btn
                v-if="!somenteLeitura && !usuarioPertenceAoCargoAtual(usuario)"
                :aria-label="t('forms.usuariosVinculadosCargo.vincularAoCargo', { cargo: cargo.nome })"
                :disabled="!cargo.papel"
                color="primary"
                icon="mdi-account-link-outline"
                size="small"
                variant="tonal"
                @click="atualizarCargoUsuario(usuario, cargo.papel)"
              />

              <SelectRole
                :modelValue="obterPapelUsuario(usuario)"
                :opcoes="opcoesCargos"
                :disabled="somenteLeitura"
                maxWidth="180"
                minWidth="160"
                hideDetails
                @update:modelValue="atualizarCargoUsuario(usuario, String($event))"
              />
            </div>
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

import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
// Types e Interfaces
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IUsuario, TPapel } from '@/models/model/core/usuario.model';

// Componentes
import ConsultaVinculosFormulario from '@/components/forms/core/fixtures/vinculos/ConsultaVinculosFormulario.vue';
import SelectRole from '@/components/forms/fixtures/SelectRole.vue';

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
 * @description Busca usuários vinculados ao cargo atual ou com alteração pendente no formulário.
 * @param pPayload - Consulta paginada acompanhada do termo de pesquisa local.
 * @returns Resposta paginada com os usuários compatíveis com o cargo atual.
 */
async function buscarUsuarios(
  pPayload: IConsultaRegistros<IUsuario> & { termoPesquisa: string },
): Promise<IRespostaConsultaRegistros<IUsuario>> {
  const usuariosFiltrados = filtrarUsuariosPorCargoEPesquisa(pPayload.termoPesquisa);
  const inicio = (pPayload.proximaEntrada as number) || 0;
  const limite = pPayload.limite || 10;
  const dados = usuariosFiltrados.slice(inicio, inicio + limite);

  return {
    ...pPayload,
    registros: dados,
    possuiMais: inicio + dados.length < usuariosFiltrados.length,
    proximaEntrada: inicio + dados.length < usuariosFiltrados.length ? inicio + dados.length : undefined,
  };
}

/**
 * @description Atualiza o cargo do usuário em memória e controla se há alteração pendente.
 * @param pUsuario - Usuário cujo vínculo será atualizado.
 * @param pPapelCargo - Papel selecionado para o usuário.
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
 * @description Filtra usuários pelo cargo aberto no formulário, mantendo os registros alterados até o submit.
 * @param pTermoPesquisa - Termo aplicado sobre nome, e-mail ou papel do usuário.
 * @returns Usuários pertencentes ao cargo ou com alterações pendentes compatíveis com a pesquisa.
 */
function filtrarUsuariosPorCargoEPesquisa(pTermoPesquisa: string): IUsuario[] {
  const termoPesquisa = normalizarTexto(pTermoPesquisa);

  return usuarios.value.filter((pUsuario) => {
    const usuarioPertenceAoCargo = usuarioPertenceAoCargoAtual(pUsuario);
    const usuarioPossuiAlteracaoPendente = usuarioComAlteracaoPendente(pUsuario);

    if (!termoPesquisa) {
      return usuarioPertenceAoCargo || usuarioPossuiAlteracaoPendente;
    }

    return [pUsuario.nome, pUsuario.email, pUsuario.papel].some((pValor) =>
      normalizarTexto(pValor).includes(termoPesquisa),
    );
  });
}

function usuarioPertenceAoCargoAtual(pUsuario: IUsuario): boolean {
  return obterPapelUsuario(pUsuario) === props.cargo.papel;
}

/**
 * @description Indica se o usuário possui alteração de cargo ainda não salva.
 * @param pUsuario - Usuário a ser verificado.
 * @returns Indica se o vínculo do usuário foi alterado no formulário.
 */
function usuarioComAlteracaoPendente(pUsuario: IUsuario): boolean {
  return chavesUsuariosAlterados.value.has(obterChaveUsuario(pUsuario));
}

/**
 * @description Resolve o papel atual do usuário a partir do model editável do formulário.
 * @param pUsuario - Usuário para o qual o papel será resolvido.
 * @returns Papel presente no model editável ou o valor original do usuário.
 */
function obterPapelUsuario(pUsuario: IUsuario): TPapel {
  return (
    usuarios.value.find((pUsuarioAtual) => obterChaveUsuario(pUsuarioAtual) === obterChaveUsuario(pUsuario))?.papel ??
    pUsuario.papel
  );
}

/**
 * @description Usa o id quando disponível e o e-mail como fallback estável para usuários mockados.
 * @param pUsuario - Usuário para o qual será gerada a chave estável.
 * @returns Chave textual única do usuário no contexto do formulário.
 */
function obterChaveUsuario(pUsuario: IUsuario): string {
  return String(pUsuario.id ?? pUsuario.email);
}

/**
 * @description Normaliza valores textuais para comparação simples na busca local.
 * @param pValor - Valor a ser convertido para texto normalizado.
 * @returns Texto sem acentos e em caixa alta para comparação.
 */
function normalizarTexto(pValor: unknown): string {
  return String(pValor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

/**
 * @description Captura o papel original dos usuários para detectar quando uma alteração foi desfeita.
 * @returns Nenhum valor.
 */
function inicializarPapeisOriginaisUsuarios(): void {
  papeisOriginaisUsuarios.value = new Map(
    usuarios.value.map((pUsuario) => [obterChaveUsuario(pUsuario), pUsuario.papel]),
  );
}

// Computadas
const contextoConsultaUsuarios = computed(() => `usuarios-vinculados-cargo:${props.cargo.papel}`);

const opcoesCargos = computed<IOpcaoSelecao<TPapel>[]>(() => {
  return props.cargos
    .filter((pCargo) => pCargo.ativo)
    .map((pCargo) => ({
      valor: pCargo.papel,
      descricao: pCargo.nome,
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
