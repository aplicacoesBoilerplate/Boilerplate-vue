export function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0') // Janeiro = 0
  const ano = data.getFullYear()

  const horas = String(data.getHours()).padStart(2, '0')
  const minutos = String(data.getMinutes()).padStart(2, '0')
  const segundos = String(data.getSeconds()).padStart(2, '0')

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`
}
