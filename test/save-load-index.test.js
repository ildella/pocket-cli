jest.setTimeout(3000)
const faker = require('faker')
const __ = require('highland')

const iterateFor = (amount, creator) => function* createArticles () {
  for (let i = 0; i < amount; i++) {
    const value = creator()
    yield value
  }
}

// const articleSample = require('./fixtures/article-sample')
const createArticle = () => ({
  // ...articleSample,
  id: faker.random.uuid(),
  url: faker.internet.url(),
  author: 'John Smith',
  // author: faker.name.firstName(),
  title: faker.lorem.sentence(),
  excerpt: faker.lorem.sentence(),
  textContent: faker.lorem.paragraphs(),
})

const lunr = require('lunr')
const builder = new lunr.Builder
builder.pipeline.add(
  lunr.trimmer,
  lunr.stopWordFilter,
)
builder.ref('id')
builder.ref('url')
builder.field('author')
builder.field('title')
builder.field('excerpt')
builder.field('textContent')
builder.field('url')

const fs = require('fs')
const fsp = fs.promises
const max = 20
const source = iterateFor(max, createArticle)
let index

beforeAll(done => {
  const now = Date.now()
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
      // console.log(idx.search('John'))
      await fsp.writeFile('index-lunr-test', serializedIdx)
      const data = await fsp.readFile('index-lunr-test')
      const parsed = JSON.parse(data)
      index = lunr.Index.load(parsed)
      done()
    })

})

test('saerch for the Authors matches all', () => {
  const results = index.search('John')
  expect(results.length).toBe(max)
  expect(results[0].score).toBe(0.024)
  expect(results[0].matchData.metadata.john).toEqual({author: {}})
})

test('saerch for everything', () => {
  const results = index.search('')
  expect(results.length).toBe(max)
  expect(results[0].score).toBe(0)
})

test('search for partials', () => {
  expect(index.search('a').length).toBe(0)
  expect(index.search('J').length).toBe(0)
  expect(index.search('Jo').length).toBe(0)
  expect(index.search('Joh').length).toBe(0)
  expect(index.search('John').length).toBe(max)
  expect(index.search('john').length).toBe(max)
})

test('search for obvious stuff', () => {
  expect(index.search('http').length).toBe(0)
})

test('saearch on specific field', () => {
  expect(index.search('title:john').length).toBe(0)
  expect(index.search('author:john').length).toBe(max)
  expect(() => index.search('titl:anything')).toThrow()
})
