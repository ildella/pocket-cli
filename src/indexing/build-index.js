/*
  Load articles from file, create index in memory (and store the index on file)
  650 articles ~ 1.3MB stores ~ 2.6MB index on 4 fields + 1 id ref ~ 0.5s load+index+save index
*/

const fs = require('fs')
const readline = require('readline')
const __ = require('highland')
const elasticlunr = require('elasticlunr')

const index = elasticlunr(function () {
  this.setRef('id')
  this.addField('authors')
  this.addField('title')
  this.addField('url')
  this.addField('excerpt')
})

const {promisify} = require('util')

const load = (path, options = {}, done) => {
  const inputStream = fs.createReadStream(path)
  const rl = readline.createInterface({input: inputStream})
  const generator = push => {
    rl.on('line', line => { push(null, line) })
    rl.on('close', () => { push(null, __.nil) })
  }
  let counter = 0
  __(generator)
    .map(line => JSON.parse(line))
    .tap(() => console.log(`indexing ${++counter} out of ${options.total}`))
    .each(article => { index.addDoc(article) })
    .done(() => {
      // console.log('Index created.')
      done(null, 'Index created')
      // fs.writeFile('/home/ildella/.config/pocketcli/index.json', JSON.stringify(index), err => {
      //   if (err) throw err
      //   done(null, 'Index stored')
      // })
    })
}

module.exports = {
  load: promisify(load)
}
