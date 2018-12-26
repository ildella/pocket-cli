const auth = require('../auth')()

const task = process.env.TASK || 'pocket-proxy-server-dev'

const orderByDesc = (key) => {
  return (a, b) => (a[key] > b[key]) ? -1 : ((b[key] > a[key]) ? 1 : 0)
}

const pocket = {

  modify: async actions => {
    const client = require('./pocket-sdk')({
      taskName: task,
      auth: auth.get()
    })
    const response = await client.modify(actions)
    const results = response.data.action_results.map(result => {
      return result ? 'success' : 'failed'
    })
    return {lines: [`${results}`]}
  },

  retrieve: async search => {
    const client = require('./pocket-sdk')({
      taskName: task,
      auth: auth.get()
    })
    const response = await client.retrieve(search)
    const data = response.data
    // const articles = Object.values(data ? data.list : [])
    const articles = Object.values(data.list)
    const parsedArticles = articles.map(article => {
      const id = article.resolved_id || article.item_id || '<No ID>'
      const authors = Object.values(article.authors || {}).map(author => author.name)
      const title = article.resolved_title || id || '<No Title>'
      const url = article.resolved_url || article.given_url || ''
      const shortUrl = url.replace('https://', '').replace('http://', '')
      const isArticle = article.is_article === 1
      const isArchived = article.status == 1
      const excerpt = article.excerpt || ''
      const newFields = {
        id: id,
        authors: authors,
        title: title,
        url: url,
        shortUrl: shortUrl,
        isArticle: isArticle,
        isArchived: isArchived,
        excerpt: excerpt
      }
      return Object.assign({}, article, newFields)
    })
    parsedArticles.sort(orderByDesc('time_added'))
    return parsedArticles
  }
}

module.exports = pocket
