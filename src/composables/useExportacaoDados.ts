import { type Ref, ref } from 'vue';

import { useSnackbarStore } from '@/stores/Snackbar.store';

import type {
  IColunaNormalizadaExportacao,
  IExecutarExportacaoDadosOptions,
  TFormatoExportacaoDados,
} from '@/models/components/IExportacaoDados';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';

type TUseExportacaoDadosReturn = {
  exportando: Ref<boolean>;
  erro: Ref<unknown>;
  exportarDados: <TParametros extends object, TItem>(
    pOptions: IExecutarExportacaoDadosOptions<TParametros, TItem>,
  ) => Promise<void>;
};

export function useExportacaoDados(): TUseExportacaoDadosReturn {
  const snackbarStore = useSnackbarStore();

  const exportando = ref(false);
  const erro = ref<unknown>(null);

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
      const registros = await pOptions.metodo(pOptions.parametros);
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

  function obterValorCelula<TItem>(pRegistro: TItem, pColuna: IColunaNormalizadaExportacao<TItem>): unknown {
    if (pColuna.valor) {
      return pColuna.valor(pRegistro);
    }

    if (typeof pRegistro === 'object' && pRegistro !== null && pColuna.chave in pRegistro) {
      return (pRegistro as Record<string, unknown>)[pColuna.chave];
    }

    return '';
  }

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

  function normalizarTextoPlano(pValor: unknown): string {
    return formatarValorExportacao(pValor)
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\t/g, ' ');
  }

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
