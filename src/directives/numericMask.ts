export default {
  mounted(el: HTMLInputElement) {
    el.addEventListener('input', numericHandler)
  },
  unmounted(el: HTMLInputElement) {
    el.removeEventListener('input', numericHandler)
  }
}

function numericHandler(e: Event) {
  const el = e.target as HTMLInputElement
  const cleaned = el.value.replace(/\D/g, '')

  if (el.value !== cleaned) {
    el.value = cleaned
    el.dispatchEvent(new Event('input'))
  }
}
