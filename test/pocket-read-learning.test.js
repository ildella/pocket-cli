require('dotenv').config()
const assert = require('assert')
const expect = require('chai').expect
const fs = require('fs').promises

const axios = require('axios')
const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})

client.interceptors.response.use(response => {
  // console.log(`intercepting axios positive response -> ${response.status}`)
  return response
}, error => {
  const response = error.response
  if (response) {
    console.log(response)
    const config = response.config
    const message = `${response.status} ${config.method} ${config.url}`
    console.error(message)
    console.error(config)
  } else { throw Error('API REQUEST FAILED BADLY - no response!?!', error) }
})

beforeAll(async () => {
  jest.accessToken = (await fs.readFile('pocket_access_token')).toString()
  jest.consumerKey = process.env.POCKET
  // console.log(jest.accessToken)
  // console.log(jest.consumerKey)
  if (!jest.accessToken || !jest.consumerKey) {
    throw Error('missing keys', jest.accessToken, jest.consumerKey)
  }
})

test('network is ok', async () => {
  const ddg = axios.create({baseURL: 'https://duckduckgo.com'})
  const response = await ddg.get('/')
  expect(response.status).to.equal(200)
  // console.log(response)
})

test('list all items with max total number', async () => {
  // const response = await client.post('get', {
  //   consumer_key: jest.consumerKey,
  //   access_token: jest.accessToken,
  //   count: 2,
  //   detailType: 'complete',
  //   sort: 'newest',
  //   state: 'all'
  // })
  // const articles = Object.values(response.data.list)
  // expect(articles).to.have.lengthOf(2)
})

test('search for keywords in URL or Title', async () => {
  const query = 'bitcoin'
  const response = await client.post('get', {
    consumer_key: jest.consumerKey,
    access_token: jest.accessToken,
    count: 8,
    detailType: 'complete',
    sort: 'oldest',
    state: 'all',
    search: query,
  })
  // console.log(response.headers)
  const articles = Object.values(response.data.list)
  //TODO: resolved o altro url? cmq parsa da http:// fino al successivo / come "domain" o "website"
  expect(articles).to.have.lengthOf(8)
  const parsed = articles.map(article => {
    const authors = Object.values(article.authors || {}).map(author => author.name)
    return {
      title: article.given_title,
      isArticle: article.is_article,
      url: article.resolved_url,
      tags: article.tags,
      authors: authors
    }
  })
  // console.log(articles.map(article => article.given_title))
  // console.log(articles.map(article => article.resolved_title))
})
