const elasticlunr = require('elasticlunr')
const __ = require('highland')
const fs = require('fs')
const readline = require('readline')

const inputStream = fs.createReadStream('/home/ildella/.config/pocketcli/localdb')
const rl = readline.createInterface({input: inputStream})
const generator = push => {
  rl.on('line', line => { push(null, line) })
  rl.on('close', () => { push(null, __.nil) })
}

const index = elasticlunr(function () {
  this.setRef('id')
  this.addField('authors')
  this.addField('title')
  this.addField('url')
  this.addField('excerpt')
})

__(generator)
  .map(line => JSON.parse(line))
  .each(article => index.addDoc(article))
  .done(() => {
    console.log('stream load completed.')
    fs.writeFile('/home/ildella/.config/pocketcli/index.json', JSON.stringify(index), (err) => {
      if (err) throw err
      console.log('index stored')
    })
  })
  // .toArray(articles => buildIndex(articles))
