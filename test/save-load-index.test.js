jest.setTimeout(50000)
const faker = require('faker')
const __ = require('highland')

const iterateFor = (amount, creator) => function* createArticles () {
  for (let i = 0; i < amount; i++) {
    const value = creator()
    yield value
  }
}

const createArticle = () => ({
  id: faker.random.uuid(),
  url: faker.internet.url(),
  title: faker.lorem.sentence(),
  athors: faker.name.firstName(),
  excerpt: faker.lorem.sentence(),
  textContent: faker.lorem.paragraphs(),
})

const builder = require('./indexer')()
const fs = require('fs')
const fsp = fs.promises
test('create N items', done => {
  const source = iterateFor(4500, createArticle)

  __(source())
    .ratelimit(1, 1)
    // .tap(console.log)
    .each(doc => {
      builder.add(doc)
    })
    .done(async () => {
      const idx = builder.build()
      const serializedIdx = JSON.stringify(idx)
      // const output = fs.createWriteStream('index-lunr')
      await fsp.writeFile('index-lunr', serializedIdx)
      done()
    })
})
