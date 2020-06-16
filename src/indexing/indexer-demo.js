const {get} = require('axios')
const {JSDOM} = require('jsdom')
const {Readability} = require('moz-readability-node')
const lunr = require('lunr')
// const natural = require('natural')
const __ = require('highland')

const {wrapPromise} = require('../highland-utils')
const fetch = async url => {
  const {data} = await get(url)
  return {content: data, url}
}
const parseDom = ({url, content}) => {
  const dom = new JSDOM(content, {
    url: url,
    referrer: url,
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000
  })
  const {window} = dom
  const {document} = window
  return document
}
const parseArticle = domDocument => new Readability(domDocument).parse()

const scrape = url => {
  __([url])
    .map(wrapPromise(fetch)).parallel(2)
    .map(parseDom)
    .map(parseArticle)
    .each(console.log)
}

const start = () => {
  scrape('https://ildella.net/2019/03/07/parse-large-text-file-with-nodejs-streams-part-2/')
}

start()
