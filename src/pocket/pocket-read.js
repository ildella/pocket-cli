const {execSync} = require('child_process')
const {DateTime} = require('luxon')
const client = require('./pocket-http')
const formatter = require('../content-formatter')
const {red, blue, bold} = require('colorette')

client.interceptors.response.use(response => {
  return response
}, error => {
  const response = error.response
  if (response) {
    const config = response.config
    const message = `${response.status} ${config.method} ${config.url}`
    console.error(red(bold(message))) //TODO use emit for this kind of low level errors
    console.error(config)
  } else {
    console.error(red(bold('Network Error')))
  }
  return {data: {list: []}}
})

const intersection = arrays => {
  return arrays.reduce((a, b) => a.filter(c => b.includes(c)))
}

const reverseIntersection = arrays => {
  return arrays.reduce((a, b) => a.filter(c => !b.includes(c)))
}

const orderByAsc = (key) => {
  return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0)
}

const orderByDesc = (key) => {
  return (a, b) => (a[key] > b[key]) ? -1 : ((b[key] > a[key]) ? 1 : 0)
}

const pocket = {}

const states = ['unread', 'archive']
const orders = ['newest', 'oldest', 'title', 'site']

pocket.queries = []
pocket.articles = []
pocket.actions = []

pocket.archive = indexes => {
  const index = indexes[0]
  return pocket.modifyQuery('archive', index)
}

pocket.expand = indexes => {
  const index = indexes[0]
  const selected = pocket.articles[Number(index) - 1]
  return {
    name: 'pocket-expand',
    indexes: indexes,
    index: index,
    execute: () => {
      const output = []
      output.push(blue(selected.excerpt))
      return {lines: output}
    }
  }
}

pocket.open = indexes => {
  const index = indexes[0]
  const selected = pocket.articles[Number(index) - 1]
  return {
    name: 'pocket-open',
    indexes: indexes,
    index: index,
    execute: () => {
      const exec = execSync(`xdg-open "${selected.url}"`)
      const output = []
      output.push(blue(selected.url))
      return {lines: output}
    }
  }
}

pocket.next = () => {
  const last = pocket.queries[pocket.queries.length - 1].query
  last.offset = last.offset + last.count
  return {
    name: 'pocket-next',
    query: last, // TODO: hash the tokens
    execute: () => { return pocket.read(last) }
  }
}

pocket.previous = () => {
  const last = pocket.queries[pocket.queries.length - 1].query
  last.offset = last.offset - last.count
  return {
    name: 'pocket-next',
    query: last, // TODO: hash the tokens
    execute: () => { return pocket.read(last) }
  }
}

pocket.modifyQuery = (action, index) => {
  if (pocket.articles.length < index) return {
    name: 'pocket-modify-none',
    action: action,
    execute: () => { return [`There is no article with index ${index}`] }
  }
  const item_id = pocket.articles[index - 1].item_id
  const actions = [
    {
      'action': action,
      'item_id': item_id,
      'time': DateTime.local().millisecond * 1000
    }
  ]
  pocket.actions.push({
    timestamp: DateTime.local(),
    actions: actions
  })
  return {
    name: 'pocket-modify',
    actions: actions,
    execute: () => { return pocket.modify(actions) }
  }
}

pocket.toQuery = (inputs = []) => {
  // const userAccessToken = (await fs.readFile('pocket_access_token')).toString()
  const reservedState = intersection([states, inputs])
  const reservedOrder = intersection([orders, inputs])
  const state = reservedState.length > 0 ? reservedState[0] : 'all'
  const order = reservedOrder.length > 0 ? reservedOrder[0] : 'newest'
  const params = reverseIntersection([inputs, states, orders])
  const defaultQuery = {
    consumer_key: process.env.POCKET,
    access_token: global.userAccessToken,
    count: 8,
    offset: 0,
    detailType: 'complete',
    sort: order,
    state: state,
    search: params.toString().replace(',', ' '),
    // since: DateTime.local().startOf('day').minus({month: 1}).ts / 1000
    since: 0
  }
  const query = defaultQuery
  pocket.queries.push({
    timestamp: DateTime.local(),
    query: query
  })
  return {
    name: 'pocket-read',
    query: query, // TODO: hash the tokens
    execute: () => { return pocket.read(query) }
  }
}

pocket.modify = async actions => {
  console.log(actions)
  const response = await client.modify(actions)
  // console.log(response)
  const output = []
  return {
    lines: output
  }
}

pocket.read = async query => {
  // TOREFACTOR - ask the driver or the query
  const response = await client.post('get', query)
  // TOREFACTOR - upstream data parser
  const articles = Object.values(response.data.list)
  const parsedArticles = articles.map(article => {
    const id = article.resolved_id || article.item_id || '<No ID>'
    const authors = Object.values(article.authors || {}).map(author => author.name)
    const title = article.resolved_title || id || '<No Title>'
    const url = article.resolved_url || article.given_url || ''
    const shortUrl = url.replace('https://', '').replace('http://', '')
    const isArticle = article.is_article == 1
    const excerpt = article.excerpt || ''
    const newFields = {
      id: id,
      authors: authors,
      title: title,
      url: url,
      shortUrl: shortUrl,
      isArticle: isArticle,
      excerpt: excerpt
    }
    return Object.assign({}, article, newFields)
  })
  parsedArticles.sort(orderByDesc('time_added'))
  pocket.articles = parsedArticles //TOFIX: the horror
  // TOREFACTOR - renderer (solo output)
  const output = []
  output.push(blue(bold(pocket.toHumanText())))
  output.push('')
  let index = 0
  for (const entry of parsedArticles) {
    index++
    output.push(formatter(entry, index))
  }
  output.push(blue(bold('Type "o 1" to open the first result in the browser')))
  output.push(blue(bold('Type "e 1" to expand the first article excerpt')))
  return {lines: output}
}

pocket.toHumanText = () => {
  const last = pocket.queries[pocket.queries.length - 1].query
  const date = DateTime.fromMillis(last.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  return `Search for "${last.search}" in "${last.state}" documents, order by "${last.sort}" starting ${date}`
}

module.exports = pocket
