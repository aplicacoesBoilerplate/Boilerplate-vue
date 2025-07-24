import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function gerarPdfRelatorio(
  elementRef: string | HTMLElement,
  nomeRelatorio: string,
  orientacao: 'portrait' | 'landscape' = 'portrait'
) {
  const element =
    typeof elementRef === 'string'
      ? document.getElementById(elementRef)
      : elementRef;

  if (!element) {
    console.error(`Elemento "${elementRef}" não encontrado.`);
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');

  if (!imgData.startsWith('data:image/png')) {
    console.error('Erro ao gerar imagem: formato inválido.', imgData.slice(0, 30));
    return;
  }

  const pdf = new jsPDF({
    orientation: orientacao,
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;

  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  } else {
    let remainingHeight = imgHeight;
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      remainingHeight -= pdfHeight;
      position -= pdfHeight;
      if (remainingHeight > 0) pdf.addPage();
    }
  }

  pdf.save(`${nomeRelatorio}.pdf`);
}
