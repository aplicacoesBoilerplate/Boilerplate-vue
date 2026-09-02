// Types e Interfaces
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';
import type { ITemplateFiltro } from '@/models/filters/ITemplateFiltro';
import type { IPreferenciaUsuario } from '@/models/services/IPreferenciaUsuario';

// Services
import { preferenciaUsuarioService } from './CPreferenciaUsuarioService';

const CONTEXTO_TEMPLATES_FILTRO = 'templates-filtro';

/**
 * @description Persiste templates privados de filtros usando as preferências do usuário autenticado.
 * Templates públicos dependem do endpoint dedicado do backend.
 */
export class CTemplateFiltroService {
  /**
   * @description Busca os templates privados disponíveis para um recurso.
   * @param pRecurso Contexto estável do recurso filtrado.
   * @returns Templates válidos persistidos pelo usuário.
   */
  public async buscarTemplates(pRecurso: string): Promise<ITemplateFiltro[]> {
    const resposta = await preferenciaUsuarioService.buscarPreferenciasUsuarioAutenticado();
    const preferencia = resposta.preferencias.find(
      (pPreferencia) => pPreferencia.contexto === CONTEXTO_TEMPLATES_FILTRO && pPreferencia.chave === pRecurso,
    );

    if (!preferencia) {
      return [];
    }

    try {
      return this.normalizarTemplates(JSON.parse(preferencia.valorJson));
    } catch {
      return [];
    }
  }

  /**
   * @description Substitui os templates privados de um recurso.
   * @param pRecurso Contexto estável do recurso filtrado.
   * @param pTemplates Templates que serão persistidos.
   * @returns Templates salvos.
   */
  public async salvarTemplates(pRecurso: string, pTemplates: ITemplateFiltro[]): Promise<ITemplateFiltro[]> {
    const templates = this.normalizarTemplates(pTemplates);
    const preferencia: IPreferenciaUsuario = {
      contexto: CONTEXTO_TEMPLATES_FILTRO,
      chave: pRecurso,
      valorJson: JSON.stringify(templates),
    };

    await preferenciaUsuarioService.salvarPreferenciaUsuarioAutenticado(preferencia);

    return templates;
  }

  private normalizarTemplates(pTemplates: unknown): ITemplateFiltro[] {
    if (!Array.isArray(pTemplates)) {
      return [];
    }

    return pTemplates.flatMap((pTemplate) => {
      if (!pTemplate || typeof pTemplate !== 'object') {
        return [];
      }

      const template = pTemplate as Partial<ITemplateFiltro>;

      if (typeof template.id !== 'string' || typeof template.nome !== 'string' || !Array.isArray(template.filtros)) {
        return [];
      }

      return [{
        id: template.id,
        nome: template.nome,
        filtros: template.filtros.map((pFiltro) => this.clonarFiltro(pFiltro)),
      }];
    });
  }

  private clonarFiltro(pFiltro: TFiltroConsultaSerializado): TFiltroConsultaSerializado {
    return {
      ...pFiltro,
      valoresSelecionados: [...(pFiltro.valoresSelecionados ?? [])],
    };
  }
}

export const templateFiltroService = new CTemplateFiltroService();
