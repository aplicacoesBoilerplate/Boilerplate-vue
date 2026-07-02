// Types e Interfaces
import type {
  IConsultaRegistrosFiltroPayload,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

const USUARIOS_CONSULTA_FILTRO: IUsuario[] = [
  {
    id: 1,
    nome: 'BOILERPLATE',
    email: 'boilerplate@gmail.com',
    papel: 'ADMIN',
    telefone: '(32) 99999-9999',
    notificar: true,
    ativo: true,
  },
  {
    id: 2,
    nome: 'GERSON',
    email: 'gerson@gmail.com',
    papel: 'USER',
    telefone: '(32) 99999-9998',
    notificar: false,
    ativo: true,
  },
  {
    id: 3,
    nome: 'MARCOS',
    email: 'marcos@gmail.com',
    papel: 'USER',
    telefone: '(32) 99999-9997',
    notificar: true,
    ativo: false,
  },
];

// Service temporário para simular a consulta auxiliar de usuários até o backend expor o endpoint definitivo.
export class CConsultaUsuariosFiltroService {
  public static async buscarRegistros(
    pPayload: IConsultaRegistrosFiltroPayload,
  ): Promise<IResultadoConsultaRegistrosFiltro<IUsuario>> {
    await new Promise((pResolver) => setTimeout(pResolver, 300));

    const termoPesquisa = CConsultaUsuariosFiltroService.normalizarTexto(pPayload.termoPesquisa);
    const proximaEntrada = Number(pPayload.proximaEntrada ?? 0);
    const limite = pPayload.limite || 10;

    const registrosFiltrados = USUARIOS_CONSULTA_FILTRO.filter((pUsuario) =>
      CConsultaUsuariosFiltroService.usuarioCorrespondePesquisa(pUsuario, pPayload.campo, termoPesquisa),
    );

    const registros = registrosFiltrados.slice(proximaEntrada, proximaEntrada + limite);
    const proximoIndice = proximaEntrada + registros.length;

    return {
      registros,
      proximaEntrada: proximoIndice < registrosFiltrados.length ? proximoIndice : undefined,
      possuiMais: proximoIndice < registrosFiltrados.length,
    };
  }

  private static normalizarTexto(pValor: unknown): string {
    return String(pValor ?? '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private static usuarioCorrespondePesquisa(pUsuario: IUsuario, pCampo: string, pTermoPesquisa: string): boolean {
    if (!pTermoPesquisa) {
      return true;
    }

    const valorCampo = CConsultaUsuariosFiltroService.normalizarTexto(pUsuario[pCampo as keyof IUsuario]);
    const valorDescricao = CConsultaUsuariosFiltroService.normalizarTexto(pUsuario.nome);
    const valorEmail = CConsultaUsuariosFiltroService.normalizarTexto(pUsuario.email);

    return (
      valorCampo.includes(pTermoPesquisa) ||
      valorDescricao.includes(pTermoPesquisa) ||
      valorEmail.includes(pTermoPesquisa)
    );
  }
}
