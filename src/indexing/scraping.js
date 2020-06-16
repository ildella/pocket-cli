const {JSDOM} = require('jsdom')
const {Readability} = require('moz-readability-node')
const axios = require('axios')
// const natural = require('natural')

const scrape = async url => {
  const {data} = await axios(url)
  const dom = new JSDOM(data, {
    url: url,
    referrer: url,
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000
  })
  const {window} = dom
  const {document} = window

  const documentClone = document.cloneNode(true)
  const article = new Readability(documentClone).parse()
  // console.log(article)
  // const tokenizer = new natural.WordTokenizer()
  // console.log(tokenizer.tokenize(article.excerpt))
  // console.log(tokenizer.tokenize(article.textContent))
  return article
}

// scrape('https://example.org')
const article = scrape('https://www.codementor.io/johnnyb/how-to-write-a-web-scraper-in-nodejs-du108266t')
console.log(article)
