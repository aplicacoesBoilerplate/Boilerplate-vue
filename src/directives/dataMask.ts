export default {
  mounted(el: HTMLInputElement) {
    el.addEventListener('input', dateHandler)
  },
  unmounted(el: HTMLInputElement) {
    el.removeEventListener('input', dateHandler)
  }
}

function dateHandler(e: Event) {
  const el = e.target as HTMLInputElement
  let digits = el.value.replace(/\D/g, '').slice(0, 8)

  let formatted = digits.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, function (_, d1, d2, d3) {
    return `${d1}${d2 ? '/' + d2 : ''}${d3 ? '/' + d3 : ''}`
  })

  el.value = formatted
  el.dispatchEvent(new Event('input'))
}
