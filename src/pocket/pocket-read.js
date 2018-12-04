const {execSync} = require('child_process')
const {DateTime} = require('luxon')
const fs = require('fs').promises
const axios = require('axios')
const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})
const formatter = require('../content-formatter')
const {red, blue, bold} = require('colorette')

client.interceptors.response.use(response => {
  return response
}, error => {
  const response = error.response
  if (response) {
    const config = response.config
    const message = `${response.status} ${config.method} ${config.url}`
    console.error(red(bold(message)))
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

pocket.expand = async (index = 1) => {
  const selected = pocket.articles[Number(index) - 1]
  return {
    name: 'pocket-expand',
    index: index,
    execute: () => {
      const output = []
      output.push(blue(selected.excerpt))
      return output
    }
  }
}

pocket.open = async (index = 1) => {
  const selected = pocket.articles[Number(index) - 1]
  return {
    name: 'pocket-open',
    index: index,
    execute: () => {
      const exec = execSync(`xdg-open "${selected.url}"`)
      const output = []
      output.push(blue(selected.url))
      return output
    }
  }
}

pocket.next = async () => {
  const last = pocket.queries[pocket.queries.length - 1].query
  last.offset = last.offset + last.count
  return {
    name: 'pocket-next',
    query: last, // TODO: hash the tokens
    execute: () => { return pocket.read(last) }
  }
}

pocket.previous = async () => {
  const last = pocket.queries[pocket.queries.length - 1].query
  last.offset = last.offset - last.count
  return {
    name: 'pocket-next',
    query: last, // TODO: hash the tokens
    execute: () => { return pocket.read(last) }
  }
}

pocket.toQuery = async (inputs = []) => {
  const userAccessToken = (await fs.readFile('pocket_access_token')).toString()
  const reservedState = intersection([states, inputs])
  const reservedOrder = intersection([orders, inputs])
  const state = reservedState.length > 0 ? reservedState[0] : 'all'
  const order = reservedOrder.length > 0 ? reservedOrder[0] : 'newest'
  const params = reverseIntersection([inputs, states, orders])
  const defaultQuery = {
    consumer_key: process.env.POCKET,
    access_token: userAccessToken,
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

pocket.read = async (query) => {
  // console.log('pocket search ->', query)
  const response = await client.post('get', query)
  const articles = Object.values(response.data.list)
  const parsedArticles = articles.map(article => {
    const authors = Object.values(article.authors || {}).map(author => author.name)
    const title = article.resolved_title || article.resolved_id || article.item_id || '<No Title - No ID>'
    const url = article.resolved_url || article.given_url || ''
    const shortUrl = url.replace('https://', '').replace('http://', '')
    return {
      title: title,
      excerpt: article.excerpt || '',
      isArticle: article.is_article == 1,
      url: url,
      shortUrl: shortUrl,
      tags: article.tags,
      authors: authors,
      time_added: article.time_added,
      time_updated: article.time_updated,
      time_read: article.time_read,
      time_favorited: article.time_favorited,
      wordCount: article.word_count || 0
    }
  })
  let index = 0
  const output = []
  parsedArticles.sort(orderByDesc('time_added'))
  pocket.articles = parsedArticles //TOFIX: the horror
  output.push(blue(bold(pocket.toHumanText())))
  output.push('')
  for (const entry of parsedArticles) {
    index++
    output.push(formatter(entry, index))
  }
  output.push(blue(bold('Type "o 1" to open the first result in the browser')))
  output.push(blue(bold('Type "e 1" to expand the first article excerpt')))
  return output
}

pocket.toHumanText = () => {
  const last = pocket.queries[pocket.queries.length - 1].query
  const date = DateTime.fromMillis(last.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  return `Search for "${last.search}" in "${last.state}" documents, order by "${last.sort}" starting ${date}`
}

module.exports = pocket
