export const getDescriptionText = (element) => {
  const text = element.textContent.split(' ')
  const descriptionHeight = element.offsetHeight
  const containerHeight = element.closest('.movie__description-container').offsetHeight

  if (descriptionHeight > containerHeight) {
    element.textContent = [...text.slice(0, text.length - 2), '...'].join(' ')
    getDescriptionText(element)
  }
}
