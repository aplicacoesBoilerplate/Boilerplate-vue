// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { IErros } from './IErros';
import type { IConsultaRegistrosFiltro } from '@/models/filters/IConsultaRegistrosFiltro';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Enums
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Services
import { CConsultaUsuariosFiltroService } from '@/services/filters/CConsultaUsuariosFiltroService';

export type TCamposFiltroErros = Omit<IErros, 'idError'>;
type TCampoFiltroErro = keyof TCamposFiltroErros | 'usuario.idUsuario';

const DESCRICAO_CAMPOS_FILTRO_ERROS: Record<TCampoFiltroErro, string> = {
  mensagem: 'Mensagem',
  arquivo: 'Arquivo',
  classe: 'Classe',
  metodo: 'Método',
  linha: 'Linha',
  httpStatusCode: 'Status HTTP',
  idUsuario: 'ID do usuário',
  'usuario.idUsuario': 'Usuário',
  usuarioReferencia: 'Referência usuário',
  dataHora: 'Data e hora',
};

const ICONE_CAMPOS_FILTRO_ERROS: Record<TCampoFiltroErro, string> = {
  mensagem: 'mdi-message-bulleted',
  arquivo: 'mdi-file-alert',
  classe: 'mdi-lock-check-outline',
  metodo: 'mdi-function',
  linha: 'mdi-numeric',
  httpStatusCode: 'mdi-web-sync',
  idUsuario: 'mdi-card-account-details',
  'usuario.idUsuario': 'mdi-card-account-details',
  usuarioReferencia: 'mdi-book-account',
  dataHora: 'mdi-calendar-clock',
};

const TIPOS_CAMPOS_FILTRO_ERROS: Record<TCampoFiltroErro, ETipoFiltro[]> = {
  mensagem: [ETipoFiltro.STRING],
  arquivo: [ETipoFiltro.STRING],
  classe: [ETipoFiltro.STRING],
  metodo: [ETipoFiltro.STRING],
  linha: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
  httpStatusCode: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
  idUsuario: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
  'usuario.idUsuario': [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
  usuarioReferencia: [ETipoFiltro.STRING],
  dataHora: [ETipoFiltro.DATE],
};

const CONSULTA_REGISTROS_FILTRO_ERROS: Partial<Record<TCampoFiltroErro, IConsultaRegistrosFiltro<IUsuario>>> = {
  'usuario.idUsuario': {
    atributoValor: 'id',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaUsuariosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  usuarioReferencia: {
    atributoValor: 'email',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaUsuariosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
};

export const MAPEAMENTO_CAMPOS_FILTRO_ERROS: ICampoFiltro<TCampoFiltroErro, any>[] = (
  Object.keys(DESCRICAO_CAMPOS_FILTRO_ERROS) as TCampoFiltroErro[]
).map((pCampo) => ({
  valor: pCampo,
  descricao: DESCRICAO_CAMPOS_FILTRO_ERROS[pCampo],
  icone: ICONE_CAMPOS_FILTRO_ERROS[pCampo],
  tipos: TIPOS_CAMPOS_FILTRO_ERROS[pCampo],
  opcoes: [],
  pesquisaPadrao: pCampo === 'mensagem',
  operadorPesquisaPadrao: pCampo === 'mensagem' ? EOperadoresFiltro.CONTEM : undefined,
  consultaRegistros: CONSULTA_REGISTROS_FILTRO_ERROS[pCampo],
}));
