let inMemory = []

const pocketArticles = {
  store: articles => {
    // inMemory.clear()
    // articles.forEach(article => inMemory.add(article))
    inMemory = articles
  },

  get: index => Object.assign({}, inMemory[Number(index) - 1])

  // fetch: () => {
  //   return inMemory.keys()
  // }
}

module.exports = pocketArticles
