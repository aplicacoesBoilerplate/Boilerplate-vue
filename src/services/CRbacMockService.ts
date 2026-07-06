// Ecossistema
import type { RouteRecordRaw } from 'vue-router';

// Types e Interfaces
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type {
  ICargoRbac,
  IPermissaoCargoRbac,
} from '@/models/model/rbac/ICargoRbac';
import { criarUsuarioPadrao, type IUsuario, type TPapel } from '@/models/model/usuario/lUsuario';

// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Mapeamentos
import {
  CARGOS_RBAC_INICIAIS,
  PERMISSOES_GERAIS_RBAC,
  RECURSO_PERMISSAO_GERAL_RBAC,
  RECURSO_PERMISSAO_ROTAS_RBAC,
  criarCargoRbacPadrao,
  permissaoEstaLiberada,
} from '@/models/model/rbac/ICargoRbac';

type TItemRotaVisivelRbac = {
  chave: string;
  pais: string[];
};

export interface IResumoCargoRbac {
  /**
   * Quantidade de permissões liberadas para o cargo.
   */
  quantidadePermissoesLiberadas: number;

  /**
   * Quantidade de usuários vinculados ao cargo.
   */
  quantidadeUsuariosVinculados: number;
}

const SEPARADOR_CHAVE_PERMISSAO = '::';

/**
 * Service temporário que simula o backend do RBAC até a API real existir.
 */
export class CRbacMockService {
  private static cargos: ICargoRbac[] = CARGOS_RBAC_INICIAIS.map((pCargo) => criarCargoRbacPadrao(pCargo));

  private static usuarios: IUsuario[] = [
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
  ];

  public static listarCargos(): ICargoRbac[] {
    return CRbacMockService.cargos.map((pCargo) => criarCargoRbacPadrao(pCargo));
  }

  public static listarUsuarios(): IUsuario[] {
    return CRbacMockService.usuarios.map((pUsuario) => ({ ...pUsuario }));
  }

  public static buscarCargoPorPapel(pPapel: TPapel): ICargoRbac | undefined {
    const cargo = CRbacMockService.cargos.find((pCargo) => pCargo.papel === pPapel);

    return cargo ? criarCargoRbacPadrao(cargo) : undefined;
  }

  public static async buscarCargos(
    pPayload: IGenericListFetchPayload,
  ): Promise<TGenericListFetchResponse<ICargoRbac>> {
    await new Promise((pResolve) => setTimeout(pResolve, 500));

    const cargosFiltrados = CRbacMockService.ordenarCargos(
      CRbacMockService.aplicarFiltrosCargos(CRbacMockService.cargos, pPayload.filtros ?? []),
      pPayload.ordem,
    );
    const inicio = (pPayload.proximaEntrada as number) || 0;
    const limite = pPayload.limite || 10;
    const dados = cargosFiltrados.slice(inicio, inicio + limite);

    return {
      items: dados,
      temMaisRegistros: inicio + dados.length < cargosFiltrados.length,
      proximaEntrada: inicio + dados.length < cargosFiltrados.length ? inicio + dados.length : undefined,
    };
  }

  public static salvarCargo(
    pCargo: ICargoRbac,
    pUsuarios: IUsuario[],
    pRotas: readonly RouteRecordRaw[],
    pPapelAnterior: TPapel | null,
  ): ICargoRbac {
    const cargoNormalizado = CRbacMockService.normalizarPermissoesCargoParaSalvar(
      criarCargoRbacPadrao(pCargo),
      pRotas,
    );

    CRbacMockService.usuarios = pUsuarios.map((pUsuario) => ({ ...pUsuario }));

    if (cargoNormalizado.id) {
      CRbacMockService.cargos = CRbacMockService.cargos.map((pCargoAtual) =>
        pCargoAtual.id === cargoNormalizado.id ? cargoNormalizado : pCargoAtual,
      );

      if (pPapelAnterior && pPapelAnterior !== cargoNormalizado.papel) {
        CRbacMockService.usuarios = CRbacMockService.usuarios.map((pUsuario) => {
          if (pUsuario.papel !== pPapelAnterior) {
            return pUsuario;
          }

          return {
            ...pUsuario,
            papel: cargoNormalizado.papel,
          };
        });
      }

      return cargoNormalizado;
    }

    const cargoCriado = {
      ...cargoNormalizado,
      id: CRbacMockService.obterProximoIdCargo(),
    };

    CRbacMockService.cargos = [cargoCriado, ...CRbacMockService.cargos];

    return cargoCriado;
  }

  public static excluirCargo(pIdCargo: number): IUsuario[] {
    const cargoExcluido = CRbacMockService.cargos.find((pCargo) => pCargo.id === pIdCargo);

    CRbacMockService.cargos = CRbacMockService.cargos.filter((pCargo) => pCargo.id !== pIdCargo);

    if (cargoExcluido) {
      CRbacMockService.usuarios = CRbacMockService.usuarios.map((pUsuario) => {
        if (pUsuario.papel !== cargoExcluido.papel) {
          return pUsuario;
        }

        return {
          ...pUsuario,
          papel: 'USER',
        };
      });
    }

    return CRbacMockService.listarUsuarios();
  }

  public static calcularResumoCargo(
    pCargo: ICargoRbac,
    pRotas: readonly RouteRecordRaw[],
  ): IResumoCargoRbac {
    const rotasLiberadas = CRbacMockService.obterRotasVisiveisRbac(pRotas).filter((pRota) =>
      permissaoEstaLiberada(pCargo, RECURSO_PERMISSAO_ROTAS_RBAC, pRota.chave),
    );
    const permissoesGeraisLiberadas = PERMISSOES_GERAIS_RBAC.filter((pPermissao) =>
      permissaoEstaLiberada(pCargo, RECURSO_PERMISSAO_GERAL_RBAC, pPermissao.valor),
    );

    return {
      quantidadePermissoesLiberadas: rotasLiberadas.length + permissoesGeraisLiberadas.length,
      quantidadeUsuariosVinculados: CRbacMockService.usuarios.filter((pUsuario) => pUsuario.papel === pCargo.papel).length,
    };
  }

  private static normalizarPermissoesCargoParaSalvar(
    pCargo: ICargoRbac,
    pRotas: readonly RouteRecordRaw[],
  ): ICargoRbac {
    const permissaoLiberadaPadrao = pCargo.comportamentoPadrao === 'liberar';
    const rotasVisiveis = CRbacMockService.obterRotasVisiveisRbac(pRotas);
    const mapaPermissoes = new Map(
      pCargo.permissoes.map((pPermissao) => [
        CRbacMockService.obterChavePermissao(pPermissao.recurso, pPermissao.acao),
        pPermissao,
      ]),
    );

    const mapaPermissoesRotas = new Map(
      rotasVisiveis.map((pRota) => [
        pRota.chave,
        CRbacMockService.obterPermissaoNormalizada(
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
      CRbacMockService.obterPermissaoNormalizada(
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

  private static obterPermissaoNormalizada(
    pMapaPermissoes: Map<string, IPermissaoCargoRbac>,
    pRecurso: string,
    pAcao: string,
    pLiberadoPadrao: boolean,
  ): IPermissaoCargoRbac {
    const permissao = pMapaPermissoes.get(CRbacMockService.obterChavePermissao(pRecurso, pAcao));

    if (permissao) {
      return { ...permissao };
    }

    return {
      recurso: pRecurso,
      acao: pAcao,
      liberado: pLiberadoPadrao,
    };
  }

  private static obterChavePermissao(pRecurso: string, pAcao: string): string {
    return `${pRecurso}${SEPARADOR_CHAVE_PERMISSAO}${pAcao}`;
  }

  private static obterRotasVisiveisRbac(
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
          ...CRbacMockService.obterRotasVisiveisRbac(pRota.children ?? [], [...pPais, chave]),
        ];
      });
  }

  private static obterProximoIdCargo(): number {
    return Math.max(0, ...CRbacMockService.cargos.map((pCargo) => pCargo.id ?? 0)) + 1;
  }

  private static ordenarCargos(pCargos: ICargoRbac[], pOrdem: IGenericListFetchPayload['ordem']): ICargoRbac[] {
    return [...pCargos].sort((pCargoAtual, pProximoCargo) => {
      const idCargoAtual = pCargoAtual.id ?? 0;
      const idProximoCargo = pProximoCargo.id ?? 0;

      return pOrdem === 'asc'
        ? idCargoAtual - idProximoCargo
        : idProximoCargo - idCargoAtual;
    });
  }

  private static aplicarFiltrosCargos(pCargos: ICargoRbac[], pFiltros: IFiltrosConsulta[]): ICargoRbac[] {
    if (!pFiltros.length) {
      return pCargos;
    }

    return pCargos.filter((pCargo) => pFiltros.every((pFiltro) => CRbacMockService.filtroCargoAtendido(pCargo, pFiltro)));
  }

  private static filtroCargoAtendido(pCargo: ICargoRbac, pFiltro: IFiltrosConsulta): boolean {
    const valorCampo = CRbacMockService.obterValorCampoCargo(pCargo, pFiltro.campo);
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

    const campoTexto = CRbacMockService.normalizarTexto(valorCampo);
    const filtroTexto = CRbacMockService.normalizarTexto(valorFiltro);

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

  private static obterValorCampoCargo(pCargo: ICargoRbac, pCampo: string): unknown {
    if (pCampo in pCargo) {
      return pCargo[pCampo as keyof ICargoRbac];
    }

    return '';
  }

  private static normalizarTexto(pValor: unknown): string {
    return String(pValor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
