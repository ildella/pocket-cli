const pocketArticles = require('../src/pocket/pocket-articles')
const mockArticles = require('./mock.articles')

test('', () => {
  console.log(mockArticles)
  pocketArticles.store(mockArticles)
  // console.log(pocketArticles.fetch())
  // expect(pocketArticles.fetch().length).toBe(1)
})