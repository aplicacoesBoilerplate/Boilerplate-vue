// Models
import { type IConfiguracaoCampo, obterEntradasMapeamentoCampos, type TMapeamentoCampos } from '@/models/components/IMapeamentoCampos';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import type { IUsuario } from '@/models/model/core/usuario.model';

// Utils
import { criarCabecalhosTabela, criarCamposFiltro } from '@/utils/MapeamentoCampos';

// Services
import { usuarioService } from '@/services/core/CUsuarioService';

import { CFormatters } from '@/classes/Utils/CFormatters';
// Classes
import { CTradutor } from '@/classes/Utils/CTradutor';

/**
 * @description Interface para representar a consulta pelo registros de erros do sistema.
 * @property {number} idErro - Identificador do registro de falha.
 * @property {string} mensagem - Mensagem de erro.
 * @property {string} arquivo - Arquivo onde o erro ocorreu.
 * @property {string} classe - Classe onde o erro ocorreu.
 * @property {string} metodo - Método onde o erro ocorreu.
 * @property {number} linha - Linha onde o erro ocorreu.
 * @property {number} httpStatusCode - Status HTTP do erro.
 * @property {number} idUsuario - Identificador do usuário que causou o erro quando existe.
 * @property {string} usuarioReferencia - E-mail de referência do usuário ou 'SISTEMA' quando não existe.
 * @property {string|Date} dataHora - Data e hora do erro.
 */
export interface IErros {
  idErro: number;
  mensagem: string;
  arquivo: string;
  classe: string;
  metodo: string;
  linha: number;
  httpStatusCode: number;
  idUsuario?: number;
  usuarioReferencia: string;
  dataHora: string | Date;
}

export type TCamposMapeamentoErro = keyof IErros;
export type TCamposFiltroErro = Exclude<IErros, 'idErro'>;

type TConfiguracaoCampoErro = 
  | IConfiguracaoCampo<TCamposMapeamentoErro, IErros>
  | IConfiguracaoCampo<TCamposMapeamentoErro, IUsuario>

type TMapeamentoErro = TMapeamentoCampos<TCamposMapeamentoErro, TConfiguracaoCampoErro>;

const MAPEAMENTO_MODEL_ERRO = {
  idErro: {
    rotulo: CTradutor.traduzir('', 'Código'),
    tabela: {
      width: 50,
      maxWidth: 100,
      sortable: true
    }
  },
  mensagem: {
    rotulo: CTradutor.traduzir('', 'Mensagem'),
    filtro: {
      icone: 'mdi-message-bulleted',
      tipos: [ETipoFiltro.STRING],
      pesquisaPadrao: true,
      operadorPesquisaPadrao: EOperadoresFiltro.CONTEM
    },
    tabela: {
      width: 300,
      maxWidth: 500,
      sortable: true
    }
  },
  arquivo: {
    rotulo: CTradutor.traduzir('', 'Arquivo'),
    filtro: {
      icone: 'mdi-file-alert',
      tipos: [ETipoFiltro.STRING]
    },
    tabela: {
      width: 200,
      maxWidth: 300,
      sortable: true
    }
  },
  classe: {
    rotulo: CTradutor.traduzir('', 'Classe'),
    filtro: {
      icone: 'mdi-lock-check-outline',
      tipos: [ETipoFiltro.STRING]
    },
    tabela: {
      width: 150,
      maxWidth: 300,
      sortable: true
    }
  },
  metodo: {
    rotulo: CTradutor.traduzir('', 'Método'),
    filtro: {
      icone: 'mdi-function',
      tipos: [ETipoFiltro.STRING]
    },
    tabela: {
      width: 200,
      maxWidth: 300,
      sortable: true
    }
  },
  linha: {
    rotulo: CTradutor.traduzir('', 'Linha'),
    filtro: {
      icone: 'mdi-numeric',
      tipos: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
    },
    tabela: {
      width: 50,
      maxWidth: 100,
      sortable: true
    }
  },
  httpStatusCode: {
    rotulo: CTradutor.traduzir('', 'Status Requisição'),
    filtro: {
      icone: 'mdi-web-sync',
      tipos: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
    },
    tabela: {
      width: 100,
      maxWidth: 150,
      sortable: true
    }
  },
  idUsuario: {
    rotulo: CTradutor.traduzir('', 'Código Usuário'),
    filtro: {
      icone: 'mdi-card-account-details',
      tipos: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
    },
    tabela: {
      width: 300,
      maxWidth: 500,
      sortable: true
    }
  },
  usuarioReferencia: {
    rotulo: CTradutor.traduzir('', 'Ref. Usuário'),
    filtro: {
      icone: 'mdi-book-account',
      tipos: [ETipoFiltro.STRING],
      consultaRegistros: {
        atributoValor: 'email',
        atributoDescricao: 'nome',
        buscarRegistros: usuarioService.consultar,
        limiteInicial: 5,
        textoVazio: 'Nenhum usuário encontrado.',
      }
    },
    tabela: {
      width: 200,
      maxWidth: 300,
      sortable: true
    }
  },
  dataHora: {
    rotulo: CTradutor.traduzir('', 'Horário do Erro'),
    filtro: {
      icone: 'mdi-calendar-clock',
      tipos: [ETipoFiltro.DATE]
    },
    tabela: {
      width: 200,
      maxWidth: 350,
      sortable: true,
      value: CFormatters.formatarDataHora
    }
  },
} satisfies TMapeamentoErro;

const ENTRADAS_MAPEAMENTO_ERRO = obterEntradasMapeamentoCampos<
  TCamposMapeamentoErro,
  TConfiguracaoCampoErro
>(MAPEAMENTO_MODEL_ERRO);

export const CAMPOS_FILTRO_ERRO = criarCamposFiltro(ENTRADAS_MAPEAMENTO_ERRO);
export const CABECALHOS_TABELA_ERRO = criarCabecalhosTabela(ENTRADAS_MAPEAMENTO_ERRO);
