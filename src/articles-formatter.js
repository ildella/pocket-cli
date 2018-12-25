const {green, magenta, cyan, cyanBright, greenBright , yellow} = require('colorette')
const {DateTime} = require('luxon')
const maxColumns = process.stdout.columns

const renderArticle = (entry, index) => {
  const indexOutput = `${index || entry.index || 'NA'}`
  const margin1 = ' '.repeat(3 - indexOutput.length)
  const url = entry.shortUrl.replace('http', 'https').replace('https://', '')
  const urlOutput = `[${url.substring(0, url.indexOf('/'))}]`
  const titleOutput = entry.title.substring(0, maxColumns - urlOutput.length - 25)
  const margin2 = ' '.repeat(5)
  const excerptOutput = entry.excerpt.substring(0, maxColumns - 15)
  const timeAdded = DateTime.fromMillis(Number(entry.time_added) * 1000).toISODate()
  const contentType = entry.isArticle ? 'Article' : 'Web Page'
  const details = `(${contentType}, ${entry.word_count} words)`
  const archived = entry.isArchived ? '(A) ' : ''
  return ` ${cyanBright(indexOutput)}.${margin1}${archived}${greenBright(titleOutput)} ${yellow(urlOutput)} ${cyan(timeAdded)} ${magenta(details)}\n${margin2}${excerptOutput}\n`
}

const render = articles => {
  const output = []
  let index = 0
  for (const entry of articles) {
    index++
    output.push(renderArticle(entry, index))
  }
  return output
}

module.exports = render

module.exports.toHumanText = query => {
  const date = DateTime.fromMillis(query.since * 1000).toLocaleString({month: 'long', day: 'numeric', year: 'numeric'})
  const searchString = green(query.search || '*')
  const orderBy = green(query.sort)
  const state = green(query.state)
  return `Search for ${searchString} in ${state} documents, order by ${orderBy} starting ${date}`
}
