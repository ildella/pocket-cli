const lunr = require('lunr')
const __ = require('highland')
const fs = require('fs')
const readline = require('readline')

const inputStream = fs.createReadStream('/home/ildella/.config/pocketcli/localdb')
const rl = readline.createInterface({input: inputStream})
const generator = push => {
  rl.on('line', line => { push(null, line) })
  rl.on('close', () => { push(null, __.nil) })
}

__(generator)
  .map(line => JSON.parse(line))
  .toArray(articles => buildIndex(articles))

let idx = {}

const buildIndex = articles => {
  const newIndex = lunr(function () {
    this.ref('id')
    this.field('authors')
    this.field('title')
    this.field('url')
    this.field('excerpt')
    articles.forEach(article => this.add(article))
  })
  idx = newIndex
}

const callIndex = () => {
  return {
    name: 'search-local-index',
    execute: async () => {
      const results = idx.search('opensource')
      console.log(results)
      return []
    }
  }
}

const {commands} = require('../cli/menu')
commands['index'] = {
  name: 'index',
  aliases: ['i'],
  description: 'Search local index',
  parse: callIndex
}

// module.exports = idx
