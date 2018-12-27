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

// const idx = lunr(function () {
//   this.ref('id')
//   this.field('authors')
//   this.field('title')
//   this.field('url')
//   this.field('excerpt')
//   __(generator)
//     .map(line => JSON.parse(line))
//     .each(article => { this.add(article) })
//     .done(() => { console.log('LOADED') })
//     .toArray(loaded => )
// })

// __(generator)
//   .map(line => JSON.parse(line))
//   .toArray(articles => )


const idx = lunr(function () {
  this.ref('id')
  this.field('authors')
  this.field('title')
  this.field('url')
  this.field('excerpt')
})

const callIndex = () => {
  return {
    name: 'search-local-index',
    execute: async () => {
      console.log(idx)
      const results = idx.search('Happy')
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

module.exports = idx
