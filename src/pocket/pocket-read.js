const {execSync} = require('child_process')
const {DateTime, Settings} = require('luxon')
Settings.defaultZoneName = 'utc'
const client = require('./pocket-cli-http')
const formatter = require('../content-formatter')
const {blue, bold} = require('colorette')

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

const history = function (name) {
  const history = {
    name: name,
    items: [],
    push: item => {
      history.items.push({
        timestamp: DateTime.local(),
        item: item
      })
    },
    get: index => history.items[Number(index) - 1].item,
    last: () => history.items[history.items.length - 1].item,
    hasIndex: index => history.items.length < index,
    pushAll: items => history.items = items // the horror
  }
  return history
}

pocket.queries = history('queries')
pocket.articles = []
pocket.actions = []

pocket.archive = indexes => {
  const index = indexes[0]
  return pocket.modifyQuery('archive', indexes)
}

pocket.delete = indexes => {
  // const index = indexes[0]
  return pocket.modifyQuery('delete', indexes)
}

pocket.print = () => {
  return {
    name: 'pocket-print',
    execute: pocket.render
  }
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

const platform = require('os').platform()
const openCommands = {
  linux: 'xdg-open',
  osx: 'open',
  windows: 'start'
}

pocket.open = indexes => {
  const index = indexes[0]
  const selected = pocket.articles[Number(index) - 1]
  return {
    name: 'pocket-open',
    indexes: indexes,
    index: index,
    execute: () => {
      const open = openCommands[platform]
      const exec = execSync(`${open} "${selected.url}"`)
      const output = []
      output.push(blue(selected.url))
      return {lines: output}
    }
  }
}

pocket.next = () => {
  const last = pocket.queries.last()
  last.offset = last.offset + last.count
  return {
    name: 'pocket-next',
    query: last,
    execute: () => { return pocket.read(last) }
  }
}

pocket.previous = () => {
  const last = pocket.queries.last()
  last.offset = last.offset - last.count
  return {
    name: 'pocket-next',
    query: last,
    execute: () => { return pocket.read(last) }
  }
}

pocket.modifyQuery = (action, ...index) => {
  const matches = index.flat().map(i => pocket.articles[i - 1]).filter(Boolean)
  const actions = matches.map(article => {
    return {
      action: action,
      item_id: article.item_id,
      time: DateTime.local().millisecond * 1000
    }
  })
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
  const reservedState = intersection([states, inputs])
  const reservedOrder = intersection([orders, inputs])
  const state = reservedState.length > 0 ? reservedState[0] : 'all'
  const order = reservedOrder.length > 0 ? reservedOrder[0] : 'newest'
  const params = reverseIntersection([inputs, states, orders])
  const search = {
    count: 8,
    offset: 0,
    detailType: 'complete',
    sort: order,
    state: state,
    search: params.toString().replace(',', ' '),
    // since: DateTime.local().startOf('day').minus({month: 1}).ts / 1000
    since: 0
  }
  pocket.queries.push(search)
  return {
    name: 'pocket-read',
    search: search,
    execute: () => { return pocket.read(search) }
  }
}

pocket.modify = async actions => {
  await client.modify(actions)
  return {lines: [`applied ${actions.length} changes`]}
}

pocket.read = async search => {
  const response = await client.retrieve(search)
  const data = response.data
  const articles = Object.values(data ? data.list : [])
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
  return pocket.render()
}

pocket.render = () => {
  const output = []
  const leftMargin = ' '.repeat(5)
  output.push('')
  output.push(`${leftMargin}${blue(bold(pocket.toHumanText()))}`)
  output.push('')
  let index = 0
  for (const entry of pocket.articles) {
    index++
    output.push(formatter(entry, index))
  }
  output.push(blue(' Type 1-8 to select or "archive 1" to archive. TAB to show commands'))
  output.push('')
  return {lines: output}
}

pocket.toHumanText = () => {
  const last = pocket.queries.last()
  const date = DateTime.fromMillis(last.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  const searchString = last.search || '*'
  return `Search for "${searchString}" in "${last.state}" documents, order by "${last.sort}" starting ${date}`
}

module.exports = pocket
