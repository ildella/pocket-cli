/*
  A convenient class to let user access history of elements
  Stores timestamp of when elements has been added
  Interpret index in the human-readable way, starting from one
*/

const {DateTime} = require('luxon')

const history = function (name) {
  let inMemory = []
  const history = {
    name: name,
    add: item => {
      inMemory.push({
        timestamp: DateTime.local().ts,
        item: item
      })
    },
    get: index => {
      if (!history.hasIndex(index)) {
        throw new Error(`Index ${index} does not exists in ${history.name}`)
      }
      return Object.assign({}, inMemory[Number(index) - 1].item)
    },
    last: () => history.get(inMemory.length),
    hasIndex: index => {
      if (index <= 0) { throw new Error('Accepts only indexes > 0')}
      return inMemory.length >= index
    },
    addAll: newItems => {
      if (!Array.isArray(newItems)) { throw new Error('addAll requires an Array')}
      inMemory = []
      newItems.forEach(item => history.add(item))
    },
    size: () => inMemory.length
  }
  return history
}

module.exports = history
