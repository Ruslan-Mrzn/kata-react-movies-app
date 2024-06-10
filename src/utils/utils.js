export const getDescriptionText = (element) => {
  const text = element.textContent.split(' ')
  const descriptionHeight = element.offsetHeight
  const containerHeight = element.closest('.movie__description-container').offsetHeight

  if (descriptionHeight > containerHeight) {
    element.textContent = [...text.slice(0, text.length - 2), '...'].join(' ')
    getDescriptionText(element)
  }
}

export const debounce = (fn, debounceTime) => {
  let calledId
  return async function callFn() {
    const args = [...arguments]
    if (calledId) {
      clearTimeout(calledId)
    }
    calledId = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
}
