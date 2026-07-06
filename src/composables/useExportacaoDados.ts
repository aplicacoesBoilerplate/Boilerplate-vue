// Ecossistema Vue
import { ref, type Ref } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';
import { useSnackbarStore } from '@/stores/Snackbar.store';

// Types e Interfaces
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { IGenericListFetchReturn, TGenericListFetchResponse } from '@/models/components/IGenericListContext';
import type {
  IColunaNormalizadaExportacao,
  IExecutarExportacaoDadosOptions,
  TFormatoExportacaoDados,
} from '@/models/components/IExportacaoDados';

// Constantes
const LIMITE_EXPORTACAO_DADOS = 100;

/**
 * @description Tipo que retorna as constantes usadas pelo composable useExportacaoDados.
 * @property {Ref<boolean>} exportando - Indica se existe uma exportação em andamento.
 * @property {Ref<unknown>} erro - Erro da última tentativa de exportação.
 * @property {function(): Promise<void>} exportarDados - Executa a consulta paginada e gera o arquivo de exportação.
 */
type TUseExportacaoDadosReturn = {
  exportando: Ref<boolean>;
  erro: Ref<unknown>;
  exportarDados: <TParametros extends object, TItem>(
    pOptions: IExecutarExportacaoDadosOptions<TParametros, TItem>,
  ) => Promise<void>;
};

/**
 * Consulta listas paginadas em série e gera arquivos de exportação sem acoplar a origem dos dados.
 */
export function useExportacaoDados(): TUseExportacaoDadosReturn {
  const genericFilterStore = useGenericFilterStore();
  const snackbarStore = useSnackbarStore();

  const exportando = ref(false);
  const erro = ref<unknown>(null);

  /**
   * @description Executa a exportação de dados, consultando registros em série e gerando o arquivo.
   * @param {IExecutarExportacaoDadosOptions<TParametros, TItem>} pOptions Opções de execução da exportação de dados.
   * @returns {Promise<void>} Promise que será resolvida quando a exportação for concluída.
   */
  async function exportarDados<TParametros extends object, TItem>(
    pOptions: IExecutarExportacaoDadosOptions<TParametros, TItem>,
  ): Promise<void> {
    exportando.value = true;
    erro.value = null;

    snackbarStore.adicionar({
      tipo: 'info',
      mensagem: 'A exportação foi iniciada e continuará em segundo plano.',
      timeout: 3000,
    });

    try {
      const registros = await consultarTodosRegistros(pOptions);
      const colunas = normalizarColunas(registros, pOptions.colunas);
      const nomeArquivo = normalizarNomeArquivo(pOptions.nomeArquivo ?? pOptions.contexto);

      await gerarArquivoExportacao({
        formato: pOptions.formato,
        registros,
        colunas,
        nomeArquivo,
      });

      snackbarStore.adicionar({
        tipo: 'success',
        mensagem: `Exportação concluída com ${registros.length.toLocaleString()} registro(s).`,
      });
    } catch (pErro) {
      erro.value = pErro;
      snackbarStore.adicionar({
        tipo: 'error',
        mensagem: normalizarMensagemErro(pErro),
      });

      throw pErro;
    } finally {
      exportando.value = false;
    }
  }

  /**
   * @description Consulta todos os registros paginados usando o método especificado.
   * @param {IExecutarExportacaoDadosOptions<TParametros, TItem>} pOptions Opções de execução da exportação de dados.
   * @returns {Promise<TItem[]>} Lista de todos os registros.
   */
  async function consultarTodosRegistros<TParametros extends object, TItem>(
    pOptions: IExecutarExportacaoDadosOptions<TParametros, TItem>,
  ): Promise<TItem[]> {
    const registros: TItem[] = [];
    let proximaEntrada: unknown;
    let temMaisRegistros = true;

    while (temMaisRegistros) {
      const resposta = await pOptions.metodo({
        ...(pOptions.parametros ?? ({} as TParametros)),
        contexto: pOptions.contexto,
        limite: LIMITE_EXPORTACAO_DADOS,
        proximaEntrada,
        ordem: pOptions.ordem ?? 'asc',
        filtros: pOptions.filtros ?? genericFilterStore.filtersApplied,
      });

      const respostaNormalizada = normalizarResposta(resposta);

      registros.push(...respostaNormalizada.items);
      proximaEntrada = respostaNormalizada.proximaEntrada;
      temMaisRegistros = respostaNormalizada.temMaisRegistros ?? respostaNormalizada.items.length >= LIMITE_EXPORTACAO_DADOS;

      if (temMaisRegistros && respostaNormalizada.items.length === 0) {
        throw new Error('A exportação foi interrompida porque a paginação não avançou.');
      }
    }

    return registros;
  }

  /**
   * @description Normaliza a resposta da consulta paginada.
   * @param {TGenericListFetchResponse<TItem>} pResposta Resposta da consulta paginada.
   * @returns {IGenericListFetchReturn<TItem>} Resposta normalizada.
   */
  function normalizarResposta<TItem>(pResposta: TGenericListFetchResponse<TItem>): IGenericListFetchReturn<TItem> {
    if (Array.isArray(pResposta)) {
      return {
        items: pResposta,
        proximaEntrada: undefined,
        temMaisRegistros: pResposta.length >= LIMITE_EXPORTACAO_DADOS,
      };
    }

    return pResposta;
  }

  /**
   * @description Normaliza as colunas para exportação.
   * @param {TItem[]} pRegistros Registros que serão usados para normalizar as colunas.
   * @param {IHeadersDataTable[]} pColunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @returns {IColunaNormalizadaExportacao<TItem>[]} Colunas normalizadas para exportação.
   */
  function normalizarColunas<TItem>(
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
   * @description Gera o arquivo de exportação com base no formato escolhido.
   * @param {object} pOptions Opções de geração do arquivo de exportação.
   * @param {TFormatoExportacaoDados} pOptions.formato Formato do arquivo que será gerado para download.
   * @param {TItem[]} pOptions.registros Registros que serão exportados.
   * @param {IColunaNormalizadaExportacao<TItem>[]} pOptions.colunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @param {string} pOptions.nomeArquivo Nome base do arquivo gerado, sem extensão.
   * @returns {Promise<void>} Promise que será resolvida quando o arquivo for gerado.
   */
  async function gerarArquivoExportacao<TItem>(pOptions: {
    formato: TFormatoExportacaoDados;
    registros: TItem[];
    colunas: IColunaNormalizadaExportacao<TItem>[];
    nomeArquivo: string;
  }): Promise<void> {
    if (pOptions.formato === 'pdf') {
      await gerarPdf(pOptions.registros, pOptions.colunas, pOptions.nomeArquivo);
      return;
    }

    if (pOptions.formato === 'excel') {
      await gerarExcel(pOptions.registros, pOptions.colunas, pOptions.nomeArquivo);
      return;
    }

    gerarTxt(pOptions.registros, pOptions.colunas, pOptions.nomeArquivo);
  }

  /**
   * @description Gera o arquivo TXT com os registros e colunas especificados.
   * @param {TItem[]} pRegistros Registros que serão exportados.
   * @param {IColunaNormalizadaExportacao<TItem>[]} pColunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @param {string} pNomeArquivo Nome base do arquivo gerado, sem extensão.
   */
  function gerarTxt<TItem>(
    pRegistros: TItem[],
    pColunas: IColunaNormalizadaExportacao<TItem>[],
    pNomeArquivo: string,
  ): void {
    const linhas = [
      pColunas.map((pColuna) => normalizarTextoPlano(pColuna.titulo)).join('\t'),
      ...pRegistros.map((pRegistro) =>
        pColunas.map((pColuna) => normalizarTextoPlano(obterValorCelula(pRegistro, pColuna))).join('\t'),
      ),
    ];

    baixarArquivo(`\uFEFF${linhas.join('\n')}`, `${pNomeArquivo}.txt`, 'text/plain;charset=utf-8');
  }

  /**
   * @description Gera o arquivo Excel com os registros e colunas especificados.
   * @param {TItem[]} pRegistros Registros que serão exportados.
   * @param {IColunaNormalizadaExportacao<TItem>[]} pColunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @param {string} pNomeArquivo Nome base do arquivo gerado, sem extensão.
   */
  async function gerarExcel<TItem>(
    pRegistros: TItem[],
    pColunas: IColunaNormalizadaExportacao<TItem>[],
    pNomeArquivo: string,
  ): Promise<void> {
    const XLSX = await import('xlsx');
    const linhas = pRegistros.map((pRegistro) => {
      return pColunas.reduce<Record<string, string>>((pLinha, pColuna) => {
        pLinha[pColuna.titulo] = formatarValorExportacao(obterValorCelula(pRegistro, pColuna));

        return pLinha;
      }, {});
    });
    const planilha = XLSX.utils.json_to_sheet(linhas, {
      header: pColunas.map((pColuna) => pColuna.titulo),
    });
    const pastaTrabalho = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(pastaTrabalho, planilha, 'Registros');
    XLSX.writeFile(pastaTrabalho, `${pNomeArquivo}.xlsx`, {
      bookType: 'xlsx',
      compression: true,
    });
  }

  /**
   * @description Gera o arquivo PDF com os registros e colunas especificados.
   * @param {TItem[]} pRegistros Registros que serão exportados.
   * @param {IColunaNormalizadaExportacao<TItem>[]} pColunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @param {string} pNomeArquivo Nome base do arquivo gerado, sem extensão.
   */
  async function gerarPdf<TItem>(
    pRegistros: TItem[],
    pColunas: IColunaNormalizadaExportacao<TItem>[],
    pNomeArquivo: string,
  ): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const documento = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const margem = 32;
    const alturaLinhaBase = 18;
    const larguraPagina = documento.internal.pageSize.getWidth();
    const alturaPagina = documento.internal.pageSize.getHeight();
    const larguraDisponivel = larguraPagina - margem * 2;
    const larguraColuna = pColunas.length ? larguraDisponivel / pColunas.length : larguraDisponivel;
    let posicaoY = margem;

    documento.setFontSize(14);
    documento.text(pNomeArquivo, margem, posicaoY);
    posicaoY += 24;

    renderizarCabecalhoPdf(documento, pColunas, margem, posicaoY, larguraColuna, alturaLinhaBase);
    posicaoY += alturaLinhaBase;

    documento.setFontSize(8);

    pRegistros.forEach((pRegistro) => {
      const valores = pColunas.map((pColuna) =>
        documento.splitTextToSize(formatarValorExportacao(obterValorCelula(pRegistro, pColuna)), larguraColuna - 8),
      );
      const alturaLinha = Math.max(alturaLinhaBase, ...valores.map((pValor) => pValor.length * 10 + 6));

      if (posicaoY + alturaLinha > alturaPagina - margem) {
        documento.addPage();
        posicaoY = margem;
        renderizarCabecalhoPdf(documento, pColunas, margem, posicaoY, larguraColuna, alturaLinhaBase);
        posicaoY += alturaLinhaBase;
        documento.setFontSize(8);
      }

      valores.forEach((pValor, pIndice) => {
        documento.text(pValor, margem + pIndice * larguraColuna + 4, posicaoY + 12);
      });

      posicaoY += alturaLinha;
    });

    documento.save(`${pNomeArquivo}.pdf`);
  }

  /**
   * @description Renderiza o cabeçalho do PDF.
   * @param pDocumento Documento PDF onde o cabeçalho será renderizado.
   * @param pColunas Colunas usadas para montar cabeçalhos e valores exportados.
   * @param pMargem Margem do cabeçalho em relação às bordas do documento.
   * @param pPosicaoY Posição Y onde o cabeçalho será renderizado.
   * @param pLarguraColuna Largura de cada coluna.
   * @param pAlturaLinha Altura de cada linha.
   */
  function renderizarCabecalhoPdf<TItem>(
    pDocumento: InstanceType<typeof import('jspdf').jsPDF>,
    pColunas: IColunaNormalizadaExportacao<TItem>[],
    pMargem: number,
    pPosicaoY: number,
    pLarguraColuna: number,
    pAlturaLinha: number,
  ): void {
    pDocumento.setFillColor(33, 150, 243);
    pDocumento.rect(pMargem, pPosicaoY - 10, pLarguraColuna * pColunas.length, pAlturaLinha, 'F');
    pDocumento.setTextColor(255, 255, 255);
    pDocumento.setFontSize(8);

    pColunas.forEach((pColuna, pIndice) => {
      pDocumento.text(pColuna.titulo, pMargem + pIndice * pLarguraColuna + 4, pPosicaoY + 2);
    });

    pDocumento.setTextColor(0, 0, 0);
  }

  /**
   * @description Obtém o valor de uma célula com base no registro e na coluna especificados.
   * @param {TItem} pRegistro Registro que será usado para obter o valor.
   * @param {IColunaNormalizadaExportacao<TItem>} pColuna Coluna usada para obter o valor.
   * @returns {unknown} Valor da célula.
   */
  function obterValorCelula<TItem>(pRegistro: TItem, pColuna: IColunaNormalizadaExportacao<TItem>): unknown {
    if (pColuna.valor) {
      return pColuna.valor(pRegistro);
    }

    if (typeof pRegistro === 'object' && pRegistro !== null && pColuna.chave in pRegistro) {
      return (pRegistro as Record<string, unknown>)[pColuna.chave];
    }

    return '';
  }

  /**
   * @description Formata o valor de uma célula para exportação.
   * @param {unknown} pValor Valor que será formatado.
   * @returns {string} Valor formatado.
   */
  function formatarValorExportacao(pValor: unknown): string {
    if (pValor === null || pValor === undefined) {
      return '';
    }

    if (typeof pValor === 'boolean') {
      return pValor ? 'Sim' : 'Não';
    }

    if (pValor instanceof Date) {
      return pValor.toLocaleString();
    }

    return String(pValor);
  }

  /**
   * @description Normaliza o texto de uma célula para texto plano.
   * @param {unknown} pValor Valor que será normalizado.
   * @returns {string} Texto plano normalizado.
   */
  function normalizarTextoPlano(pValor: unknown): string {
    return formatarValorExportacao(pValor).replace(/\r?\n|\r/g, ' ').replace(/\t/g, ' ');
  }

  /**
   * @description Baixa um arquivo com o conteúdo especificado.
   * @param {BlobPart} pConteudo Conteúdo do arquivo que será baixado.
   * @param {string} pNomeArquivo Nome do arquivo que será baixado.
   * @param {string} pMimeType Tipo MIME do arquivo que será baixado.
   */
  function baixarArquivo(pConteudo: BlobPart, pNomeArquivo: string, pMimeType: string): void {
    const blob = new Blob([pConteudo], { type: pMimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = pNomeArquivo;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  }

  /**
   * @description Normaliza o nome do arquivo para exportação.
   * @param {string} pNomeArquivo Nome do arquivo que será normalizado.
   * @returns {string} Nome do arquivo normalizado.
   */
  function normalizarNomeArquivo(pNomeArquivo: string): string {
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
   * @description Normaliza a mensagem de erro para exportação.
   * @param {unknown} pErro Erro que será normalizado.
   * @returns {string} Mensagem de erro normalizada.
   */
  function normalizarMensagemErro(pErro: unknown): string {
    if (typeof pErro === 'string') {
      return pErro;
    }

    if (pErro instanceof Error) {
      return pErro.message;
    }

    if (typeof pErro === 'object' && pErro !== null && 'mensagem' in pErro) {
      return String((pErro as { mensagem?: unknown }).mensagem);
    }

    return 'Não foi possível concluir a exportação.';
  }

  return {
    exportando,
    erro,
    exportarDados,
  };
}
