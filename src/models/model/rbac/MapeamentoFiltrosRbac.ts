// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { IConsultaRegistrosFiltro } from '@/models/filters/IConsultaRegistrosFiltro';
import type { ICargoRbac } from '@/models/model/rbac/ICargoRbac';

// Enums
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Mapeamentos
import { COMPORTAMENTOS_PADRAO_PERMISSAO } from '@/models/model/rbac/ICargoRbac';

// Services
import { CConsultaCargosFiltroService } from '@/services/filters/CConsultaCargosFiltroService';

export type TCamposFiltroRbac = Pick<ICargoRbac, 'nome' | 'descricao' | 'comportamentoPadrao' | 'ativo'>;

const DESCRICAO_CAMPOS_FILTRO_RBAC: Record<keyof TCamposFiltroRbac, string> = {
  nome: 'Nome',
  descricao: 'Descrição',
  comportamentoPadrao: 'Comportamento padrão',
  ativo: 'Ativo',
};

const ICONE_CAMPOS_FILTRO_RBAC: Record<keyof TCamposFiltroRbac, string> = {
  nome: 'mdi-shield-account-outline',
  descricao: 'mdi-text-box-outline',
  comportamentoPadrao: 'mdi-lock-check-outline',
  ativo: 'mdi-check-circle',
};

const TIPOS_CAMPOS_FILTRO_RBAC: Record<keyof TCamposFiltroRbac, ETipoFiltro[]> = {
  nome: [ETipoFiltro.STRING],
  descricao: [ETipoFiltro.STRING],
  comportamentoPadrao: [ETipoFiltro.SELECT],
  ativo: [ETipoFiltro.BOOLEAN],
};

const OPCOES_CAMPOS_FILTRO_RBAC: Partial<Record<keyof TCamposFiltroRbac, { valor: unknown; descricao: string }[]>> = {
  comportamentoPadrao: COMPORTAMENTOS_PADRAO_PERMISSAO.map((pComportamento) => ({
    valor: pComportamento.valor,
    descricao: pComportamento.descricao,
  })),
};

const CONSULTA_REGISTROS_FILTRO_RBAC: Partial<Record<keyof TCamposFiltroRbac, IConsultaRegistrosFiltro<ICargoRbac>>> = {
  nome: {
    atributoValor: 'nome',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaCargosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum cargo encontrado.',
  },
};

export const MAPEAMENTO_CAMPOS_FILTRO_RBAC: ICampoFiltro<keyof TCamposFiltroRbac, ICargoRbac>[] = (
  Object.keys(DESCRICAO_CAMPOS_FILTRO_RBAC) as Array<keyof TCamposFiltroRbac>
).map((pCampo) => ({
  valor: pCampo,
  descricao: DESCRICAO_CAMPOS_FILTRO_RBAC[pCampo],
  icone: ICONE_CAMPOS_FILTRO_RBAC[pCampo],
  tipos: TIPOS_CAMPOS_FILTRO_RBAC[pCampo],
  opcoes: OPCOES_CAMPOS_FILTRO_RBAC[pCampo],
  pesquisaPadrao: pCampo === 'nome',
  operadorPesquisaPadrao: pCampo === 'nome' ? EOperadoresFiltro.CONTEM : undefined,
  consultaRegistros: CONSULTA_REGISTROS_FILTRO_RBAC[pCampo],
}));
