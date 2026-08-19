import type { IIconeMaterialDesign, IMetadadoIconeMaterialDesign } from '@/models/components/IIconeMaterialDesign';

import { CNormalizadores } from '@/classes/Utils/CNormalizadores';

const URL_METADADOS_ICONES = 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/meta.json';

/**
 * @description Consulta e prepara o catalogo de icones compativel com a fonte MDI instalada.
 */
export class CIconeMaterialDesignService {
  /**
   * @description Busca o metadado oficial dos icones Material Design.
   * @returns Lista de icones normalizados para a interface.
   */
  static async obterCatalogo(): Promise<IIconeMaterialDesign[]> {
    const resposta = await fetch(URL_METADADOS_ICONES);

    if (!resposta.ok) {
      throw new Error('Falha ao carregar o catálogo de ícones Material Design.');
    }

    const dados: unknown = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error('O catálogo de ícones Material Design possui formato inválido.');
    }

    return dados
      .filter(CIconeMaterialDesignService.ehMetadadoIcone)
      .map((pIcone) => ({
        nome: pIcone.name,
        valor: CNormalizadores.normalizarIconeMaterialDesign(pIcone.name),
        aliases: pIcone.aliases,
      }));
  }

  /**
   * @description Valida o formato mínimo necessário do metadado remoto.
   * @param pValor - Valor retornado pelo endpoint.
   * @returns Indica se o valor pode ser usado como metadado de ícone.
   */
  private static ehMetadadoIcone(pValor: unknown): pValor is IMetadadoIconeMaterialDesign {
    if (typeof pValor !== 'object' || pValor === null) {
      return false;
    }

    const metadado = pValor as Partial<IMetadadoIconeMaterialDesign>;

    return (
      typeof metadado.name === 'string' &&
      metadado.name.length > 0 &&
      Array.isArray(metadado.aliases) &&
      metadado.aliases.every((pAlias) => typeof pAlias === 'string')
    );
  }
}
