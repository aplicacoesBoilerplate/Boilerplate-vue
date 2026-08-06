// Models
import { type IConfiguracaoCampo, obterEntradasMapeamentoCampos, type TMapeamentoCampos } from '@/models/components/IMapeamentoCampos';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import type { IPermissaoCargoRbac, IRedirecionamentoInicialRbac, TComportamentoPadraoPermissao } from './rbac.types';
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';
import type { TPapel } from '@/models/model/core/usuario.model';

import { criarCabecalhosTabela, criarCamposFiltro } from '@/utils/MapeamentoCampos';

// Services
import { cargoRbacService } from '@/services/core/CCargoRbacService';

import { CFormatters } from '@/classes/Utils/CFormatters';
// Utils
import { CTradutor } from '@/classes/Utils/CTradutor';

/**
 * @description Define um cargo com suas permissões.
 * @property {number} id - Identificador do cargo.
 * @property {TPapel} papel - Papel usado nas permissões e no vínculo com usuários.
 * @property {string} nome - Nome de exibição do cargo.
 * @property {string} icone - Ícone usado para representar o cargo na interface.
 * @property {string} descricao - Descrição curta para orientar administradores.
 * @property {TComportamentoPadraoPermissao} comportamentoPadrao - Comportamento usado quando uma permissão específica ainda não foi configurada.
 * @property {IPermissaoCargoRbac[]} permissoes - Permissões configuradas explicitamente para o cargo.
 * @property {IRedirecionamentoInicialRbac} redirecionamentoInicial - Rota inicial e filtros aplicados após autenticação.
 * @property {boolean} ativo - Controla se o cargo pode ser atribuído a usuários.
 * @property {IAuditoriaRegistro} auditoria - Metadados de criação e última atualização.
 */
export interface ICargoRbac {
  id?: number;
  papel: TPapel;
  nome: string;
  icone: string;
  descricao?: string;
  comportamentoPadrao: TComportamentoPadraoPermissao;
  permissoes: IPermissaoCargoRbac[];
  redirecionamentoInicial: IRedirecionamentoInicialRbac;
  ativo: boolean;
  auditoria?: IAuditoriaRegistro;
}

// Mapeamentos das opções para seleção de comportamento padrão do RBAC quanto as permissões.
export const COMPORTAMENTOS_PADRAO_PERMISSAO: IOpcaoSelecao<TComportamentoPadraoPermissao>[] = [
  {
    valor: 'bloquear',
    descricao: 'Bloquear por padrão',
    icone: 'mdi-lock-outline',
    cor: 'error',
  },
  {
    valor: 'liberar',
    descricao: 'Liberar por padrão',
    icone: 'mdi-lock-open-outline',
    cor: 'success',
  },
];

/**
 * @description Cria um cargo RBAC com valores padrão.
 * @param pDados - Dados parciais para inicializar o cargo.
 * @returns Cargo RBAC criado.
 */
export function criarCargoRbacPadrao(pDados: Partial<ICargoRbac> = {}): ICargoRbac {
  return {
    id: pDados.id,
    papel: pDados.papel ?? '',
    nome: pDados.nome ?? '',
    icone: pDados.icone ?? 'mdi-shield-account-outline',
    descricao: pDados.descricao ?? '',
    comportamentoPadrao: pDados.comportamentoPadrao ?? 'bloquear',
    permissoes: pDados.permissoes ? [...pDados.permissoes] : [],
    redirecionamentoInicial: {
      path: pDados.redirecionamentoInicial?.path ?? '',
      name: pDados.redirecionamentoInicial?.name,
      filtros: pDados.redirecionamentoInicial?.filtros ? [...pDados.redirecionamentoInicial.filtros] : [],
    },
    ativo: pDados.ativo ?? true,
    auditoria: pDados.auditoria,
  };
}

export type TCamposFiltroRbac = keyof Pick<ICargoRbac, 'nome' | 'descricao' | 'comportamentoPadrao' | 'ativo'>;
type TMapeamentoRbac = TMapeamentoCampos<
  TCamposFiltroRbac,
  IConfiguracaoCampo<TCamposFiltroRbac, ICargoRbac>
>;

const MAPEAMENTO_MODEL_RBAC = {
  nome: {
    rotulo: CTradutor.traduzir('', 'Nome'),
    filtro: {
      icone: 'mdi-shield-account-outline',
      tipos: [ETipoFiltro.STRING],
      pesquisaPadrao: true,
      operadorPesquisaPadrao: EOperadoresFiltro.CONTEM,
      consultaRegistros: {
        atributoValor: 'nome',
        atributoDescricao: 'nome',
        buscarRegistros: cargoRbacService.consultar,
        limiteInicial: 5,
        textoVazio: 'Nenhum cargo encontrado.',
      }
    },
    tabela: {
      width: 200,
      maxWidth: 300,
      sortable: true
    }
  },
  descricao: {
    rotulo: CTradutor.traduzir('', 'Descrição'),
    filtro: {
      icone: 'mdi-text-box-outline',
      tipos: [ETipoFiltro.STRING]
    },
    tabela: {
      width: 300,
      maxWidth: 600,
      sortable: true
    }
  },
  comportamentoPadrao: {
    rotulo: CTradutor.traduzir('', 'Comportamento Padrão'),
    filtro: {
      icone: 'mdi-lock-check-outline',
      tipos: [ETipoFiltro.SELECT],
      opcoes: COMPORTAMENTOS_PADRAO_PERMISSAO,
    },
    tabela:  {
      width: 150,
      maxWidth: 200,
      sortable: true,
    }
  },
  ativo: {
    rotulo: CTradutor.traduzir('', 'Ativo'),
    filtro: {
      icone: 'mdi-check-circle',
      tipos: [ETipoFiltro.BOOLEAN],
      disponivelAgrupamento: true,
    },
    tabela: {
      align: 'center',
      width: 50,
      maxWidth: 100,
      sortable: true,
      value: (pItem: ICargoRbac) => CFormatters.formatarBooleano(pItem.ativo),
      chartFormatter: CFormatters.formatarBooleano,
    }
  },
} satisfies TMapeamentoRbac;

const ENTRADAS_MAPEAMENTO_RBAC = obterEntradasMapeamentoCampos<
  TCamposFiltroRbac,
  IConfiguracaoCampo<TCamposFiltroRbac, ICargoRbac>
>(MAPEAMENTO_MODEL_RBAC);

export const CAMPOS_FILTRO_RBAC = criarCamposFiltro(ENTRADAS_MAPEAMENTO_RBAC);
export const CABECALHOS_TABELA_RBAC = criarCabecalhosTabela(ENTRADAS_MAPEAMENTO_RBAC);

/**
 * @description Verifica se uma permissão específica está liberada para um cargo.
 * @param pCargo - Cargo RBAC a ser verificado.
 * @param pRecurso - Recurso da permissão.
 * @param pAcao - Ação da permissão.
 * @returns True se a permissão estiver liberada, false caso contrário.
 */
export function permissaoEstaLiberada(
  pCargo: Pick<ICargoRbac, 'comportamentoPadrao' | 'permissoes'>,
  pRecurso: string,
  pAcao: string,
): boolean {
  const permissao = pCargo.permissoes.find(
    (pPermissao) => pPermissao.recurso === pRecurso && pPermissao.acao === pAcao,
  );

  return permissao?.liberado ?? pCargo.comportamentoPadrao === 'liberar';
}
