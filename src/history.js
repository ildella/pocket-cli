const {DateTime} = require('luxon')

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
    // get: index => history.items[Number(index) - 1].item,
    get: index => Object.assign({}, history.items[Number(index) - 1].item),
    // last: () => history.items[history.items.length - 1].item,
    last: () => history.get(history.items.length),
    hasIndex: index => history.items.length < index,
    pushAll: items => history.items = items // TOFIX: the horror
  }
  return history
}

module.exports = history
