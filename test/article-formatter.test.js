const formatter = require('../src/pocket/article-formatter')

test('format', () => {
  const entry = {
    time_added: '1543489802',
    title: 'something something dark side, and a lot of this bla bla is going to be cut',
    shortUrl: 'http://sub.domain.com/path/to/article',
    excerpt: 'NOTE: This is a draft in progress, so that I can get some feedback from early reviewers.'
  }
  const formattedText = formatter(entry, 0, 100)
  expect(formattedText).toContain('something something dark side,')
  expect(formattedText).not.toContain('of this bla bla is going to be cut')
  expect(formattedText).not.toContain('of')
})
