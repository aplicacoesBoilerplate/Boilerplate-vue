export default {
  mounted(el: HTMLInputElement) {
    el.addEventListener('input', onInput, false)
  },
  unmounted(el: HTMLInputElement) {
    el.removeEventListener('input', onInput, false)
  },
}

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  let digits = el.value.replace(/\D/g, '')

  if (digits.length > 11) digits = digits.slice(0, 11)

  let formatted = ''
  if (digits.length <= 10) {
    formatted = digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, function (_, d1, d2, d3) {
      return `${d1 ? `(${d1}` : ''}${d1 && d2 ? `) ${d2}` : ''}${d2 && d3 ? `-${d3}` : ''}`
    })
  } else {
    formatted = digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, function (_, d1, d2, d3) {
      return `${d1 ? `(${d1}` : ''}${d1 && d2 ? `) ${d2}` : ''}${d2 && d3 ? `-${d3}` : ''}`
    })
  }

  el.value = formatted
  el.dispatchEvent(new Event('input')) // dispara v-model
}
