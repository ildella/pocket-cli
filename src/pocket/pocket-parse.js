const {blue} = require('colorette')
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
const articles = []
// const actions = []

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
      execute: open(selected)
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
  }
}

const modify = (action, ...index) => {
  const matches = index.flat().map(i => articles[i - 1]).filter(Boolean)
  const actions = matches.map(article => {
    return {
      action: action,
      item_id: article.item_id,
      time: DateTime.local().ts / 1000
    }
  })
  actions.push({
    timestamp: DateTime.local(),
    actions: actions
  })
  return {
    name: 'pocket-modify',
    actions: actions,
    execute: () => { return pocketExecute.modify(actions) }
  }
}

const retrieve = (inputs = []) => {
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
    name: 'pocket-read',
    search: search,
    execute: () => { return pocketExecute.retrieve(search) }
  }
}

module.exports = pocketParse
