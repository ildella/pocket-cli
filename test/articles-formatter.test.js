const formatter = require('../src/pocket/articles-formatter')

test('format', () => {
  const entry = {
    time_added: '1543489802',
    title: 'something something dark side, and a lot of useless bla bla in this very very long title.',
    shortUrl: 'http://sub.domain.com/path/to/article',
    excerpt: 'NOTE: This is a draft in progress, so that I can get some feedback from early reviewers. It is not yet ready for use.  Unless otherwise noted, the contents of this repository are Copyright ©2017 by Christopher Allen @ChristopherA <ChristopherA@LifeWithAlacrity.com> and are licensed CC-BY.'
  }
  const formattedText = formatter([entry])
  // console.log(formattedText)
})
