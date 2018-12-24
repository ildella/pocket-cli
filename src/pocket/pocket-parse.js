const {gray, cyan, green, blue, yellow, bold} = require('colorette')
const {DateTime, Settings} = require('luxon')
Settings.defaultZoneName = 'utc'

const pocketExecute = require('./pocket-execute')
const {open} = require('./commons-execute')

const intersection = arrays => {
  return arrays.reduce((a, b) => a.filter(c => b.includes(c)))
}

const reverseIntersection = arrays => {
  return arrays.reduce((a, b) => a.filter(c => !b.includes(c)))
}

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

const queries = history('queries')
let articles = []

const indexes = cyan('1-8')
const command1 = cyan('open 1')
const command2 = cyan('archive 2')
const listGuide = gray(`Type ${indexes} to select an index or isuse commands like ${command1} and ${command2}. Press TAB to show commands`)
const noResultsGuide = yellow('No results found')

const formatter = require('../content-formatter')

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
  const date = DateTime.fromMillis(query.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  const searchString = green(query.search || '*')
  const orderBy = green(query.sort)
  const state = green(query.state)
  return `Search for ${searchString} in ${state} documents, order by ${orderBy} starting ${date}`
}

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
    const selected = articles[Number(index) - 1]
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
    const selected = indexes.map(index => articles[Number(index) - 1])
    return {
      name: 'pocket-open',
      indexes: indexes,
      execute: () => { return open(selected) }
    }
  },

  next: () => {
    const last = queries.last()
    last.offset = last.offset + last.count
    return {
      name: 'pocket-next',
      query: last,
      execute: () => { return pocketExecute.retrieve(last) }
    }
  },

  previous: () => {
    const last = queries.last()
    last.offset = last.offset - last.count
    return {
      name: 'pocket-next',
      query: last,
      execute: () => { return pocketExecute.retrieve(last) }
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
    queries.push(search)
    return {
      name: 'pocket-list',
      search: search,
      execute: async () => {
        // TOFIX: await should not stay here... 
        const parsedArticles = await pocketExecute.retrieve(search)
        // TOFIX: the horror
        articles = articles.concat(parsedArticles)
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
  }

}

const actionsHistory = []
const modify = (action, ...index) => {
  const matches = index.flat().map(i => articles[i - 1]).filter(Boolean)
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
    name: `pocket-modify`,
    actions: actions,
    execute: () => { return pocketExecute.modify(actions) }
  }
}

module.exports = pocketParse
module.exports.modify = modify
