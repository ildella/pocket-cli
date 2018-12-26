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

const idx = lunr(function () {
  this.ref('id')
  // this.field('authors')
  this.field('title')
  // this.field('url')
  // this.field('excerpt')
  // this.add({
  //   id: '1',
  //   title: 'Happy dog'
  // })
  // console.log(this)
  __(generator)
    .map(line => JSON.parse(line))
    .each(article => {
      // console.log(article.title)
      this.add(article)
    })
    .done(() => {
      console.log('DONE')
      console.log(idx)
      // console.log(idx.search('start'))
      // console.log(this)
    })
    // .toArray(loaded => console.log(loaded.length))
})

module.exports = idx

// const results = idx.search('Happy')
// console.log(results[0])
// console.log(idx)
// console.log(results[0].matchData.metadata)
// console.log(results[0].matchData.metadata.happi)
