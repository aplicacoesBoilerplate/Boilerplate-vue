// Types e Interfaces
import type { IColunaNormalizadaExportacao } from '@/models/components/IExportacaoDados';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TPapel } from '@/models/model/core/usuario.model';

import { CFormatters } from './CFormatters';
// Utils
import { CTradutor } from './CTradutor';

/**
 * @description Classe utilitária responsável por centralizar funções de normalização genéricas da aplicação.
 */
export class CNormalizadores {
  /**
   * @description Normaliza uma mensagem de erro de qualquer tipo em uma string legível.
   * @param pErro O erro a ser normalizado.
   * @param pMensagemPadrao Mensagem padrão a ser retornada caso o erro não possua uma mensagem identificável.
   * @returns A mensagem de erro normalizada.
   */
  static erro(pErro: unknown, pMensagemPadrao = CTradutor.traduzir('common.messages.requestFailed')): string {
    if (typeof pErro === 'string') {
      return pErro;
    }

    if (pErro instanceof Error) {
      return pErro.message;
    }

    if (typeof pErro === 'object' && pErro !== null && 'mensagem' in pErro) {
      return String((pErro as { mensagem?: unknown }).mensagem);
    }

    return pMensagemPadrao;
  }

  /**
   * @description Normaliza o nome do arquivo para exportação.
   * @param {string} pNomeArquivo Nome do arquivo que será normalizado.
   * @returns {string} Nome do arquivo normalizado.
   */
  static normalizarNomeArquivo(pNomeArquivo: string): string {
    const nomeNormalizado = pNomeArquivo
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return nomeNormalizado || 'exportacao';
  }

  /**
   * @description Normaliza o texto de uma célula para texto plano.
   * @param {unknown} pValor Valor que será normalizado.
   * @returns {string} Texto plano normalizado.
   */
  static normalizarTextoExportacaoDados(pValor: unknown): string {
    return CFormatters.formatarValorExportacao(pValor)
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\t/g, ' ');
  }

  /**
   * @description Normaliza as colunas para exportação.
   * @param {TItem[]} pRegistros Registros que serão usados para normalizar as colunas.
   * @param {IHeadersDataTable[]} pColunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @returns {IColunaNormalizadaExportacao<TItem>[]} Colunas normalizadas para exportação.
   */
  static normalizarColunas<TItem>(
    pRegistros: TItem[],
    pColunas?: IHeadersDataTable[],
  ): IColunaNormalizadaExportacao<TItem>[] {
    if (pColunas?.length) {
      return pColunas
        .filter((pColuna) => pColuna.key !== 'actions')
        .map((pColuna) => ({
          titulo: pColuna.title,
          chave: pColuna.key,
          valor: pColuna.value as ((pItem: TItem) => unknown) | undefined,
        }));
    }

    const primeiroRegistro = pRegistros[0];

    if (!primeiroRegistro || typeof primeiroRegistro !== 'object') {
      return [];
    }

    return Object.keys(primeiroRegistro).map((pChave) => ({
      titulo: pChave,
      chave: pChave,
    }));
  }

  /**
   * @description Normaliza um valor string para ser usado como papel de cargo.
   * @param pValor - Valor string a ser normalizado.
   * @returns Papel de cargo normalizado.
   */
  static normalizarPapelCargo(pValor: string): TPapel {
    return pValor
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_ -]/g, '')
      .replace(/[\s-]+/g, '_')
      .toUpperCase() as TPapel;
  }

  /**
   * @description Remove prefixos e caracteres incompatíveis para obter somente o nome do ícone.
   * @param pValor - Valor digitado, selecionado ou persistido.
   * @returns Nome do ícone sem o prefixo `mdi-`.
   */
  static obterNomeIconeMaterialDesign(pValor: unknown): string {
    if (typeof pValor !== 'string') {
      return '';
    }

    return pValor
      .trim()
      .replace(/^mdi[\s:-]*/i, '')
      .replace(/\s+/g, '-')
      .replace(/^-+/, '')
      .toLowerCase();
  }

  /**
   * @description Garante que o valor esteja no formato aceito pelo `v-icon`.
   * @param pValor - Nome do ícone com ou sem prefixo.
   * @returns Valor normalizado com o prefixo `mdi-`, ou string vazia.
   */
  static normalizarIconeMaterialDesign(pValor: unknown): string {
    const nomeIcone = CNormalizadores.obterNomeIconeMaterialDesign(pValor);
    return nomeIcone ? `mdi-${nomeIcone}` : '';
  }

  /**
   * @description Preenche e normaliza os atributos de um objeto de formulário de destino com base em um objeto de dados parciais.
   * @param pFormulario O objeto de formulário que será preenchido.
   * @param pDados Objeto contendo os dados a serem mesclados no formulário.
   * @returns O formulário preenchido e atualizado com os novos dados.
   */
  static popularCamposFormulario<TFormulario extends object>(
    pFormulario: TFormulario,
    pDados: Partial<Record<keyof TFormulario, unknown>>,
  ): TFormulario {
    return (Object.keys(pDados) as Array<keyof TFormulario>).reduce<TFormulario>((pFormularioAtual, pCampo) => {
      const valor = pDados[pCampo];

      if (pCampo in pFormularioAtual && valor !== null && valor !== undefined) {
        return {
          ...pFormularioAtual,
          [pCampo]: valor,
        };
      }

      return pFormularioAtual;
    }, pFormulario);
  }
}
