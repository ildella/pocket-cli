const {exec} = require('child_process')

const cliOpen = require('../cli/open')

module.exports = {
  open: selected => {
    selected.forEach(article => {
      exec(`${cliOpen.get()} "${article.url}"`)
    })
    return {lines: []}
  }
}
