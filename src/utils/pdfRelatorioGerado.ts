import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function gerarPdfRelatorio(
  elementRef: string | HTMLElement,
  nomeRelatorio: string,
  orientacao: 'portrait' | 'landscape' = 'portrait'
) {
  const element =
    typeof elementRef === 'string'
      ? document.getElementById(elementRef)
      : elementRef

  if (!element) {
    console.error(`Elemento "${elementRef}" não encontrado.`)
    return
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  // Renderiza diretamente o elemento já exibido (com estilos aplicados)
  const canvas = await html2canvas(element as HTMLElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#2a2a2a',
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: orientacao,
    unit: 'px',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  } else {
    const pageCanvas = document.createElement('canvas')
    const pageHeightPx = (pageHeight * canvas.width) / pageWidth

    let renderedHeight = 0

    while (renderedHeight < canvas.height) {
      const currentPageCanvas = document.createElement('canvas')
      currentPageCanvas.width = canvas.width
      currentPageCanvas.height = pageHeightPx

      const ctx = currentPageCanvas.getContext('2d')!
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, 0, canvas.width, pageHeightPx)
      ctx.drawImage(
        canvas,
        0,
        renderedHeight,
        canvas.width,
        pageHeightPx,
        0,
        0,
        canvas.width,
        pageHeightPx
      )

      const pageData = currentPageCanvas.toDataURL('image/png')
      if (renderedHeight > 0) pdf.addPage()
      pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, pageHeight)

      renderedHeight += pageHeightPx
    }
  }

  pdf.save(`${nomeRelatorio}.pdf`)
}
