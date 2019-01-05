const {green, gray, cyan, blue, yellow} = require('colorette')
const {DateTime, Settings} = require('luxon')
Settings.defaultZoneName = 'utc'

const {intersection, reverseIntersection} = require('../arrays-utils')
const {open} = require('../commons-execute')
const history = require('../history')

const pocketAuth = require('./pocket-auth')
const pocketExecute = require('./pocket-execute')

const states = ['unread', 'archive']
const orders = ['newest', 'oldest', 'title', 'site']

const actionsHistory = []
const queries = history('queries')
const localArticles = require('../local-articles')
const defaultSearch = {
  count: 8,
  offset: 0,
  detailType: 'complete',
  since: 0
}

const pocketParse = {

  login: () => {
    return {
      name: 'pocket-auth',
      execute: async () => {
        await pocketAuth.login()
        return {lines: [green('User logged in')]}
      }
    }
  },

  logout: () => {
    return {
      name: 'pocket-auth',
      execute: async () => {
        pocketAuth.logout()
        return {lines: [green('User logged out')]}
      }
    }
  },

  archive: (...indexes) => {
    return modify({action: 'archive', indexes: indexes})
  },

  delete: indexes => {
    return modify({action: 'delete', indexes: indexes})
  },

  favorite: indexes => {
    return modify({action: 'favorite', indexes: indexes})
  },

  readd: indexes => {
    return modify({action: 'readd', indexes: indexes})
  },

  tag: inputs => {
    // console.log('inputs', inputs)
    const allIndexes = ['1', '2', '3', '4', '5', '6', '7', '8']
    const tags = reverseIntersection([inputs, allIndexes]).join(', ')
    const indexes = intersection([inputs, allIndexes])
    return modify({action: 'tags_add', custom: {tags: tags}, indexes: indexes})
  },

  expand: indexes => {
    const index = indexes[0]
    const selected = localArticles.get(index)
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
    const selected = indexes.map(index => localArticles.get(index))
    return {
      name: 'pocket-open',
      indexes: indexes,
      execute: () => { return open(selected) }
    }
  },

  next: () => {
    const search = queries.size() > 0 ? queries.last() : defaultSearch
    // console.log(search)
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
    const search = Object.assign({}, {
      sort: order,
      state: state,
      search: params.toString().replace(',', ' '),
      // since: DateTime.local().startOf('day').minus({month: 1}).ts / 1000
    }, defaultSearch)
    return {
      name: 'pocket-list',
      search: search,
      execute: () => { return retrieve(search) },
      render: articles => { return render(search, articles) }
    }
  },

  select: index => {
    const article = localArticles.get(index)
    const opts = options(article.isArchived)
    return {
      name: 'select-query',
      execute: () => {
        return {
          lines: [toSingleLine(opts)],
          prompt: yellow('select: ')
        }
      },
      getCommand: actionIndex => {
        return opts[actionIndex]
      }
    }
  }

}

const retrieve = async search => {
  queries.add(search)
  const retrievedArticles = await pocketExecute.retrieve(search)
  localArticles.store(retrievedArticles)
  return retrievedArticles
}

const modify = ({action, custom = {}, indexes}) => {
  const matches = indexes.flat().map(i => localArticles.get(i)).filter(Boolean)
  const actions = matches.map(article => {
    const base = {
      action: action,
      item_id: article.item_id,
      time: DateTime.local().ts / 1000
    }
    return {...base, ...custom}
  })
  return {
    // name: `pocket-modify-${action}`,
    name: 'pocket-modify',
    actions: actions,
    execute: () => {
      actionsHistory.push({
        timestamp: DateTime.local(),
        actions: actions
      })
      return pocketExecute.modify(actions)
    }
  }
}

const indexes = cyan('1-8')
const command1 = cyan('open 1')
const command2 = cyan('archive 2')
const listGuide = gray(`Type ${indexes} to select an index or isuse commands like ${command1} and ${command2}. Press TAB to show commands`)
const noResultsGuide = yellow('No results found')

const formatter = require('./articles-formatter')
const {toHumanText} = require('./articles-formatter')
const {toSingleLine} = require('../commons-formatter')

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

const options = isArchived => {
  return {
    '1': 'open',
    '2': 'expand',
    '3': 'favorite',
    '4': isArchived ? 'readd' : 'archive',
    '5': 'delete',
  }
}

module.exports = pocketParse
