<template>
  <v-container
    class="fill-height pb-0 overflow-hidden"
    fluid
  >
    <GenericView
      ref="genericViewRef"
      :contexto="CONTEXTO_LISTA_CARGOS"
      :serviceFetch="fetchCargosMock"
      :exibirExportacao="false"
      textoVazio="Nenhum cargo encontrado."
      textoFinal="Todos os cargos foram carregados."
      @novoRegistro="handleGerenciarRegistro"
    >
      <template #activator-novo-registro="{ handleNovoRegistro, tooltipProps }">
        <DialogFormCargoRbac
          v-model:exibirDialog="exibirDialogCargo"
          v-model:cargo="modelFormCargo"
          v-model:usuarios="usuariosMock"
          :modoEdicao="modoEdicaoCargo"
          :cargosDisponiveis="cargos"
          @salvar="salvarCargo"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="mergeProps(props, tooltipProps)"
              color="primary"
              icon="mdi-plus"
              size="x-small"
              variant="tonal"
              @click="handleNovoRegistro"
            />
          </template>
        </DialogFormCargoRbac>
      </template>

      <template #default="{ items }">
        <GenericInfiniteListItem
          v-for="cargo in items as ICargoRbac[]"
          :key="cargo.id"
          :item="cargo"
          itemKey="id"
        >
          <v-list-item
            class="border rounded mb-2 pa-3"
            lines="three"
          >
            <template #prepend>
              <v-avatar
                :color="cargo.ativo ? 'primary' : 'grey'"
                class="text-white"
              >
                <v-icon :icon="cargo.icone" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold text-primary">
              {{ cargo.nome }}
            </v-list-item-title>

            <v-list-item-subtitle>
              <div class="d-flex flex-wrap ga-2 mt-1">
                <v-chip
                  size="small"
                  variant="tonal"
                  prepend-icon="mdi-identifier"
                >
                  {{ cargo.codigo }}
                </v-chip>

                <v-chip
                  :color="cargo.comportamentoPadrao === 'liberar' ? 'success' : 'error'"
                  :prepend-icon="cargo.comportamentoPadrao === 'liberar' ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
                  size="small"
                  variant="tonal"
                >
                  {{ cargo.comportamentoPadrao === 'liberar' ? 'Libera por padrão' : 'Bloqueia por padrão' }}
                </v-chip>

                <v-chip
                  color="info"
                  prepend-icon="mdi-shield-check-outline"
                  size="small"
                  variant="tonal"
                >
                  {{ calcularPermissoesLiberadas(cargo) }} liberações
                </v-chip>

                <v-chip
                  color="secondary"
                  prepend-icon="mdi-account-group-outline"
                  size="small"
                  variant="tonal"
                >
                  {{ contarUsuariosCargo(cargo.codigo) }} usuário(s)
                </v-chip>
              </div>
            </v-list-item-subtitle>

            <v-list-item-subtitle class="mt-2">
              {{ cargo.descricao || 'Sem descrição cadastrada.' }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  color="info"
                  size="small"
                  class="mr-2"
                  @click.stop="handleGerenciarRegistro({ modoEdicao: true, item: cargo })"
                />
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
                  @click.stop="excluirCargo(cargo.id)"
                />
              </div>
            </template>
          </v-list-item>
        </GenericInfiniteListItem>
      </template>
    </GenericView>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { mergeProps, ref } from 'vue';
import { useRouter, type RouteRecordRaw } from 'vue-router';

// Types e Interfaces
import {
  CARGOS_RBAC_INICIAIS,
  PERMISSOES_GERAIS_RBAC,
  RECURSO_PERMISSAO_GERAL_RBAC,
  RECURSO_PERMISSAO_ROTAS_RBAC,
  criarCargoRbacPadrao,
  permissaoEstaLiberada,
  type ICargoRbac,
  type IPermissaoCargoRbac,
} from '@/models/model/rbac/rbac.models';
import { criarUsuarioPadrao, type IUsuario, type TPapel } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Componentes
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import DialogFormCargoRbac from '@/components/dialogs/DialogFormCargoRbac.vue';

type TItemRotaVisivelRbac = {
  chave: string;
  pais: string[];
};

// Constantes
const CONTEXTO_LISTA_CARGOS = 'lista-cargos-rbac';
const SEPARADOR_CHAVE_PERMISSAO = '::';

// Composables
const router = useRouter();

// Reativas
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const cargos = ref<ICargoRbac[]>(CARGOS_RBAC_INICIAIS.map((pCargo) => criarCargoRbacPadrao(pCargo)));
const usuariosMock = ref<IUsuario[]>([
  criarUsuarioPadrao({
    id: 1,
    nome: 'BOILERPLATE',
    email: 'boilerplate@gmail.com',
    papel: 'ADMIN',
    telefone: '(32) 99999-9999',
    notificar: true,
    ativo: true,
  }),
  criarUsuarioPadrao({
    id: 2,
    nome: 'GERSON',
    email: 'gerson@gmail.com',
    papel: 'USER',
    telefone: '(32) 99999-9998',
    notificar: false,
    ativo: true,
  }),
  criarUsuarioPadrao({
    id: 3,
    nome: 'MARCOS',
    email: 'marcos@gmail.com',
    papel: 'USER',
    telefone: '(32) 99999-9997',
    notificar: true,
    ativo: false,
  }),
]);
const exibirDialogCargo = ref(false);
const modoEdicaoCargo = ref(false);
const modelFormCargo = ref<ICargoRbac>(criarCargoRbacPadrao());
const codigoCargoAntesEdicao = ref<TPapel | null>(null);

// Funções
async function fetchCargosMock(pPayload: IGenericListFetchPayload): Promise<TGenericListFetchResponse<ICargoRbac>> {
  await new Promise((pResolve) => setTimeout(pResolve, 500));

  const cargosFiltrados = aplicarFiltrosCargos(cargos.value, pPayload.filtros ?? []);
  const inicio = (pPayload.proximaEntrada as number) || 0;
  const limite = pPayload.limite || 10;
  const dados = cargosFiltrados.slice(inicio, inicio + limite);

  return {
    items: dados,
    temMaisRegistros: inicio + dados.length < cargosFiltrados.length,
    proximaEntrada: inicio + dados.length < cargosFiltrados.length ? inicio + dados.length : undefined,
  };
}

function handleGerenciarRegistro(pPayload: { modoEdicao: boolean; item?: ICargoRbac }): void {
  modoEdicaoCargo.value = pPayload.modoEdicao;

  if (pPayload.modoEdicao && pPayload.item) {
    codigoCargoAntesEdicao.value = pPayload.item.codigo;
    modelFormCargo.value = criarCargoRbacPadrao({
      ...pPayload.item,
      permissoes: [...pPayload.item.permissoes],
    });
  } else {
    codigoCargoAntesEdicao.value = null;
    modelFormCargo.value = criarCargoRbacPadrao();
  }

  exibirDialogCargo.value = true;
}

async function salvarCargo(): Promise<void> {
  const cargoNormalizado = normalizarPermissoesCargoParaSalvar(criarCargoRbacPadrao(modelFormCargo.value));

  if (modoEdicaoCargo.value && cargoNormalizado.id) {
    cargos.value = cargos.value.map((pCargo) => (pCargo.id === cargoNormalizado.id ? cargoNormalizado : pCargo));

    if (codigoCargoAntesEdicao.value && codigoCargoAntesEdicao.value !== cargoNormalizado.codigo) {
      usuariosMock.value = usuariosMock.value.map((pUsuario) => {
        if (pUsuario.papel !== codigoCargoAntesEdicao.value) {
          return pUsuario;
        }

        return {
          ...pUsuario,
          papel: cargoNormalizado.codigo,
        };
      });
    }
  } else {
    cargos.value = [
      {
        ...cargoNormalizado,
        id: obterProximoIdCargo(),
      },
      ...cargos.value,
    ];
  }

  codigoCargoAntesEdicao.value = null;
  await genericViewRef.value?.resetAndLoad();
}

function normalizarPermissoesCargoParaSalvar(pCargo: ICargoRbac): ICargoRbac {
  const permissaoLiberadaPadrao = pCargo.comportamentoPadrao === 'liberar';
  const rotasVisiveis = obterRotasVisiveisRbac(router.options.routes);
  const mapaPermissoes = new Map(
    pCargo.permissoes.map((pPermissao) => [
      obterChavePermissao(pPermissao.recurso, pPermissao.acao),
      pPermissao,
    ]),
  );

  const mapaPermissoesRotas = new Map(
    rotasVisiveis.map((pRota) => [
      pRota.chave,
      obterPermissaoNormalizada(
        mapaPermissoes,
        RECURSO_PERMISSAO_ROTAS_RBAC,
        pRota.chave,
        permissaoLiberadaPadrao,
      ),
    ]),
  );

  rotasVisiveis.forEach((pRota) => {
    if (!mapaPermissoesRotas.get(pRota.chave)?.liberado) {
      return;
    }

    pRota.pais.forEach((pPai) => {
      const permissaoPai = mapaPermissoesRotas.get(pPai);

      if (!permissaoPai) {
        return;
      }

      mapaPermissoesRotas.set(pPai, {
        ...permissaoPai,
        liberado: true,
      });
    });
  });

  const permissoesRotas = rotasVisiveis
    .map((pRota) => mapaPermissoesRotas.get(pRota.chave))
    .filter((pPermissao): pPermissao is IPermissaoCargoRbac => Boolean(pPermissao));
  const permissoesGerais = PERMISSOES_GERAIS_RBAC.map((pPermissao) =>
    obterPermissaoNormalizada(
      mapaPermissoes,
      RECURSO_PERMISSAO_GERAL_RBAC,
      pPermissao.valor,
      permissaoLiberadaPadrao,
    ),
  );

  return {
    ...pCargo,
    permissoes: [...permissoesRotas, ...permissoesGerais],
  };
}

function obterPermissaoNormalizada(
  pMapaPermissoes: Map<string, IPermissaoCargoRbac>,
  pRecurso: string,
  pAcao: string,
  pLiberadoPadrao: boolean,
): IPermissaoCargoRbac {
  const permissao = pMapaPermissoes.get(obterChavePermissao(pRecurso, pAcao));

  if (permissao) {
    return { ...permissao };
  }

  return {
    recurso: pRecurso,
    acao: pAcao,
    liberado: pLiberadoPadrao,
  };
}

function obterChavePermissao(pRecurso: string, pAcao: string): string {
  return `${pRecurso}${SEPARADOR_CHAVE_PERMISSAO}${pAcao}`;
}

async function excluirCargo(pIdCargo: number | undefined): Promise<void> {
  if (!pIdCargo) {
    return;
  }

  const cargoExcluido = cargos.value.find((pCargo) => pCargo.id === pIdCargo);

  cargos.value = cargos.value.filter((pCargo) => pCargo.id !== pIdCargo);

  if (cargoExcluido) {
    usuariosMock.value = usuariosMock.value.map((pUsuario) => {
      if (pUsuario.papel !== cargoExcluido.codigo) {
        return pUsuario;
      }

      return {
        ...pUsuario,
        papel: 'USER',
      };
    });
  }

  await genericViewRef.value?.resetAndLoad();
}

function obterProximoIdCargo(): number {
  return Math.max(0, ...cargos.value.map((pCargo) => pCargo.id ?? 0)) + 1;
}

function calcularPermissoesLiberadas(pCargo: ICargoRbac): number {
  const rotasLiberadas = obterChavesRotasVisiveis(router.options.routes).filter((pRota) =>
    permissaoEstaLiberada(pCargo, RECURSO_PERMISSAO_ROTAS_RBAC, pRota),
  );
  const permissoesGeraisLiberadas = PERMISSOES_GERAIS_RBAC.filter((pPermissao) =>
    permissaoEstaLiberada(pCargo, RECURSO_PERMISSAO_GERAL_RBAC, pPermissao.valor),
  );

  return rotasLiberadas.length + permissoesGeraisLiberadas.length;
}

function contarUsuariosCargo(pCodigoCargo: TPapel): number {
  return usuariosMock.value.filter((pUsuario) => pUsuario.papel === pCodigoCargo).length;
}

function obterChavesRotasVisiveis(pRotas: readonly RouteRecordRaw[]): string[] {
  return obterRotasVisiveisRbac(pRotas).map((pRota) => pRota.chave);
}

function obterRotasVisiveisRbac(
  pRotas: readonly RouteRecordRaw[],
  pPais: string[] = [],
): TItemRotaVisivelRbac[] {
  return pRotas
    .filter((pRota) => !pRota.meta?.hidden)
    .flatMap((pRota) => {
      const chave = String(pRota.name ?? pRota.path);

      return [
        {
          chave,
          pais: pPais,
        },
        ...obterRotasVisiveisRbac(pRota.children ?? [], [...pPais, chave]),
      ];
    });
}

function aplicarFiltrosCargos(pCargos: ICargoRbac[], pFiltros: IFiltrosConsulta[]): ICargoRbac[] {
  if (!pFiltros.length) {
    return pCargos;
  }

  return pCargos.filter((pCargo) => pFiltros.every((pFiltro) => filtroCargoAtendido(pCargo, pFiltro)));
}

function filtroCargoAtendido(pCargo: ICargoRbac, pFiltro: IFiltrosConsulta): boolean {
  const valorCampo = obterValorCampoCargo(pCargo, pFiltro.campo);
  const valorFiltro = pFiltro.valor;
  const valoresSelecionados = pFiltro.valoresSelecionados?.length ? pFiltro.valoresSelecionados : [valorFiltro];

  if (pFiltro.condicao === EOperadoresFiltro.VERDADEIRO) {
    return valorCampo === true;
  }

  if (pFiltro.condicao === EOperadoresFiltro.FALSO) {
    return valorCampo === false;
  }

  if (pFiltro.condicao === EOperadoresFiltro.SELECAO) {
    return valoresSelecionados.map(String).includes(String(valorCampo));
  }

  if (pFiltro.condicao === EOperadoresFiltro.EXCECAO) {
    return !valoresSelecionados.map(String).includes(String(valorCampo));
  }

  const campoTexto = normalizarTexto(valorCampo);
  const filtroTexto = normalizarTexto(valorFiltro);

  if (pFiltro.condicao === EOperadoresFiltro.IGUAL) {
    return campoTexto === filtroTexto;
  }

  if (pFiltro.condicao === EOperadoresFiltro.DIFERENTE) {
    return campoTexto !== filtroTexto;
  }

  if (pFiltro.condicao === EOperadoresFiltro.COMECA_COM) {
    return campoTexto.startsWith(filtroTexto);
  }

  if (pFiltro.condicao === EOperadoresFiltro.TERMINA_COM) {
    return campoTexto.endsWith(filtroTexto);
  }

  if (pFiltro.condicao === EOperadoresFiltro.NAO_CONTEM) {
    return !campoTexto.includes(filtroTexto);
  }

  return campoTexto.includes(filtroTexto);
}

function obterValorCampoCargo(pCargo: ICargoRbac, pCampo: string): unknown {
  if (pCampo in pCargo) {
    return pCargo[pCampo as keyof ICargoRbac];
  }

  return '';
}

function normalizarTexto(pValor: unknown): string {
  return String(pValor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
</script>
