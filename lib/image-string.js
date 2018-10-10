module.exports = function imageString ({ link, query }) {
  if (!query) return link
  return `${link}?unbox=${query.unbox}`
}
