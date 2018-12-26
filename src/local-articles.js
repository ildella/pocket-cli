const history = require('./history')

const localArticles = history('articles')

module.exports = {
  store: articles => localArticles.addAll(articles),
  get: index => localArticles.get(index)
}
