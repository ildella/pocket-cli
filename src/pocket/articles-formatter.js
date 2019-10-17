const {green} = require('colorette')
const {DateTime} = require('luxon')
const maxColumns = process.stdout.columns || 100

const renderArticle = require('./article-formatter')

module.exports = articles => {
  const output = []
  let index = 0
  for (const entry of articles) {
    index++
    output.push(renderArticle(entry, index, maxColumns))
  }
  return output
}

module.exports.toHumanText = query => {
  const date = DateTime.fromMillis(query.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  const searchString = green(query.search || '*')
  const orderBy = green(query.sort)
  const state = green(query.state)
  return `Search for ${searchString} in ${state} documents, order by ${orderBy} starting ${date}`
}
