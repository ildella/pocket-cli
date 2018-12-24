const {gray, cyan, green, blue, yellow, bold} = require('colorette')
const {DateTime, Settings} = require('luxon')
Settings.defaultZoneName = 'utc'

const auth = require('../auth')()
const formatter = require('../content-formatter')

const task = process.env.TASK || 'pocket-proxy-server-dev'
const indexes = cyan('1-8')
const command1 = cyan('open 1')
const command2 = cyan('archive 2')
const listGuide = gray(`Type ${indexes} to select an index or isuse commands like ${command1} and ${command2}. Press TAB to show commands`)
const noResultsGuide = yellow('No results found')

const orderByDesc = (key) => {
  return (a, b) => (a[key] > b[key]) ? -1 : ((b[key] > a[key]) ? 1 : 0)
}

const render = articles => {
  const output = []
  let index = 0
  for (const entry of articles) {
    index++
    output.push(formatter(entry, index))
  }
  return output
}

const toHumanText = query => {
  // const last = queries.last()
  const date = DateTime.fromMillis(query.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  const searchString = green(query.search || '*')
  const orderBy = green(query.sort)
  const state = green(query.state)
  return `Search for ${searchString} in ${state} documents, order by ${orderBy} starting ${date}`
}

const pocket = {

  modify: async actions => {
    const client = require('./pocket-cli-http')({
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
    const client = require('./pocket-cli-http')({
      taskName: task,
      auth: auth.get()
    })
    const response = await client.retrieve(search)
    const data = response.data
    const articles = Object.values(data ? data.list : [])
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
    // articles = parsedArticles //TOFIX: the horror
    const renderedArticles = render(parsedArticles)
    const output = [''].concat(renderedArticles)
    const guide = articles.length > 0 ? listGuide : noResultsGuide
    const leftMargin = ' '.repeat(4)
    output.push(`${leftMargin}${blue(toHumanText(search))}`)
    output.push(`${leftMargin}${guide}`)
    output.push('')
    return {lines: output}
  }
}

module.exports = pocket
