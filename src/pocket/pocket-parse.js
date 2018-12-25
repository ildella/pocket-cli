const {gray, cyan, blue, yellow} = require('colorette')
const {DateTime, Settings} = require('luxon')
Settings.defaultZoneName = 'utc'

const {intersection, reverseIntersection} = require('../arrays-utils')
const history = require('../history')
const {open} = require('../commons-execute')
const pocketExecute = require('./pocket-execute')

const states = ['unread', 'archive']
const orders = ['newest', 'oldest', 'title', 'site']

const actionsHistory = []
const queries = history('queries')
let lastRetrievedArticles = []

const indexes = cyan('1-8')
const command1 = cyan('open 1')
const command2 = cyan('archive 2')
const listGuide = gray(`Type ${indexes} to select an index or isuse commands like ${command1} and ${command2}. Press TAB to show commands`)
const noResultsGuide = yellow('No results found')

const formatter = require('../articles-formatter')
const {toHumanText} = require('../articles-formatter')

const pocketParse = {

  archive: indexes => {
    return modify('archive', indexes)
  },

  delete: indexes => {
    return modify('delete', indexes)
  },

  favorite: indexes => {
    return modify('favorite', indexes)
  },

  tag: indexes => {
    return modify('tags_add', indexes)
  },

  // print: () => {
  //   return {
  //     name: 'pocket-print',
  //     execute: pocket.render
  //   }
  // },

  expand: indexes => {
    const index = indexes[0]
    const selected = lastRetrievedArticles[Number(index) - 1]
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
  },

  open: indexes => {
    const selected = indexes.map(index => lastRetrievedArticles[Number(index) - 1])
    return {
      name: 'pocket-open',
      indexes: indexes,
      execute: () => { return open(selected) }
    }
  },

  next: () => {
    const search = queries.last()
    search.offset = search.offset + search.count
    return {
      name: 'pocket-next',
      search: search,
      execute: () => { return retrieve(search) },
      render: articles => { return render(search, articles) }
    }
  },

  previous: () => {
    const search = queries.last()
    search.offset = search.offset - search.count
    return {
      name: 'pocket-next',
      search: search,
      execute: () => { return retrieve(search) },
      render: articles => { return render(search, articles) }
    }
  },

  list: (inputs = []) => {
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
    return {
      name: 'pocket-list',
      search: search,
      execute: () => { return retrieve(search) },
      render: articles => { return render(search, articles) }
    }
  }
}

const render = (search, articles) => {
  const renderedArticles = formatter(articles)
  const output = [''].concat(renderedArticles)
  const guide = articles.length > 0 ? listGuide : noResultsGuide
  const leftMargin = ' '.repeat(5)
  output.push(`${leftMargin}${blue(toHumanText(search))}`)
  output.push(`${leftMargin}${guide}`)
  output.push('')
  return {lines: output}
}

const retrieve = async search => {
  queries.push(search)
  const retrievedArticles = await pocketExecute.retrieve(search)
  lastRetrievedArticles = retrievedArticles
  return retrievedArticles
}

const modify = (action, ...index) => {
  const matches = index.flat().map(i => lastRetrievedArticles[i - 1]).filter(Boolean)
  const actions = matches.map(article => {
    return {
      action: action,
      item_id: article.item_id,
      time: DateTime.local().ts / 1000
    }
  })
  actionsHistory.push({
    timestamp: DateTime.local(),
    actions: actions
  })
  return {
    // name: `pocket-modify-${action}`,
    name: 'pocket-modify',
    actions: actions,
    execute: () => { return pocketExecute.modify(actions) }
  }
}

module.exports = pocketParse
module.exports.modify = modify
